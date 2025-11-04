"use client"

import type React from "react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, Package, FileText, Loader2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Request } from "@/models/models"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface Props {
  req: Request
  projects: string[]
  category: string
  getReqsFunc: () => void
}

const MarkAsReturnButton: React.FC<Props> = ({ req, projects, category, getReqsFunc }) => {
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [value, setValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const returningComponent = async (type: number) => {
    try {
      setIsProcessing(true)
      const promises: Promise<Response>[] = []

      // Add inventory update to promises only if type === 0
      if (type === 0) {
        const inventoryUpdatePromise = fetch(`api/inventory`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: category,
            _id: req.inventoryId,
            reqId: req._id,
            task: 2,
            quantity: req.quantity,
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Inventory update failed: ${response.statusText}`)
          }
          return response
        })

        promises.push(inventoryUpdatePromise)
      } else {
        const inventoryUpdatePromise = fetch(`api/inventory`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: category,
            _id: req.inventoryId,
            reqId: req._id,
            task: 3,
            quantity: req.quantity,
            project: value,
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Inventory update failed: ${response.statusText}`)
          }
          return response
        })

        promises.push(inventoryUpdatePromise)
      }

      // Request update promise
      const requestUpdatePromise = fetch(`api/request`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          _id: req._id,
          task: 1,
          returnedProject: value,
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Request update failed: ${response.statusText}`)
        }
        return response
      })

      promises.push(requestUpdatePromise)

      // Returning user component
      try {
        await fetch(`/api/user_data?pn=${req.userId}`, {
          method: "PUT",
          body: JSON.stringify({
            task: 1,
            reqId: req._id,
            returned: true,
          }),
        })
      } catch (err) {
        console.error("Error updating user data:", err)
        throw new Error("Failed to update user data")
      }

      // Execute all promises concurrently
      await Promise.all(promises)

      toast({
        title: "Component Returned",
        description:
          type === 0
            ? "Component has been marked as returned"
            : `Component has been marked as used in project: ${value}`,
      })

      setDialogOpen(false)
      setPopoverOpen(false)
      getReqsFunc()
    } catch (err) {
      console.error("Error in processing requests:", err)
      toast({
        title: "Error",
        description: "Failed to process return request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value !== "") {
      returningComponent(1)
    } else {
      toast({
        title: "Selection Required",
        description: "Please select a project before submitting",
        variant: "destructive",
      })
    }
  }

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300" size="sm">
            <Package className="h-4 w-4 mr-2" />
            Mark as Returned
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 border-none shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
          <h4 className="font-semibold text-lg">Return Component</h4>
          <p className="text-sm text-green-100 mt-1">Select how this component was used</p>
        </div>

        <div className="p-4 space-y-4 bg-white">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Package className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">{req.component}</p>
              <p className="text-sm text-gray-500">Quantity: {req.quantity}</p>
            </div>
          </div>

          <div className="grid gap-3">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-between hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all duration-300"
                >
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Used in Project
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center">Select Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4 p-2">
                  <div className="grid flex-1 gap-2">
                    <label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                      Project Name
                    </label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
                          {value ? projects.find((project) => project === value) : "Select Project..."}
                          <ArrowRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search project..." />
                          <CommandList>
                            <CommandEmpty>No project found.</CommandEmpty>
                            <CommandGroup>
                              {projects.map((project) => (
                                <CommandItem
                                  key={project}
                                  value={project}
                                  onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn("mr-2 h-4 w-4", value === project ? "opacity-100" : "opacity-0")}
                                  />
                                  {project}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Submit</>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              onClick={() => returningComponent(0)}
              variant="outline"
              className="justify-between hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300"
              disabled={isProcessing}
            >
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Return as Component
              </div>
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            <p>• Return as component if it wasn&apos;t used in any project</p>
            <p>• Select a project if the component was used in a project</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default MarkAsReturnButton

