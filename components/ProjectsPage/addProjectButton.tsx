"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Upload, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UploadButton } from "@/lib/utils/uploadthing"
import { useToast } from "@/hooks/use-toast"
import SuperAdminInventoryCategoryCombo from "../InventoryPage/superAdminInventoryCategory"
import { motion } from "framer-motion"

interface Props {
  category: string
  isSuperAdmin: boolean
}

const AddProjectButton: React.FC<Props> = ({ category, isSuperAdmin }) => {
  const [title, setTitle] = useState("")
  const [leadName, setLeadName] = useState("")
  const [leadEmail, setLeadEmail] = useState("")
  const [image, setImage] = useState("")
  const [imageName, setImageName] = useState("")
  const [projCategory, setProjCategory] = useState(category)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  // Submit
  const addProject = async () => {
    try {
      setIsSubmitting(true)
      await fetch(`/api/projects`, {
        method: "POST",
        body: JSON.stringify({
          category: projCategory,
          title: title,
          leadName: leadName,
          leadEmail: leadEmail,
          image: image,
          completed: false,
          startDate: new Date().toISOString(),
          endDate: "Ongoing",
        }),
        headers: {
          "Content-type": "application/json",
        },
      })

      toast({
        title: "Project added successfully!",
        description: `${title} has been added to your projects.`,
      })

      // Reset form
      setTitle("")
      setLeadName("")
      setLeadEmail("")
      setImage("")
      setImageName("")
      setIsOpen(false)
    } catch (error) {
      console.log(error)
      toast({
        title: "An error has occurred",
        description: "Could not add project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!image) {
      toast({
        title: "Image required",
        description: "Please upload an image before submitting.",
        variant: "destructive",
      })
      return
    }
    addProject()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="float-right bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Project
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Add New Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="max-h-[83vh] overflow-y-auto">
          <div className="grid gap-6 py-4">
            <motion.div
              className="grid grid-cols-4 items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="title" className="text-right text-lg font-bold">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Inverted Walker"
                className="col-span-3 border-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              className="grid grid-cols-4 items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor="category" className="text-right text-lg font-bold">
                Category
              </Label>
              <div className="col-span-3">
                {isSuperAdmin ? (
                  <SuperAdminInventoryCategoryCombo onChange={setProjCategory} />
                ) : (
                  <div className="px-3 py-2 rounded-md bg-gray-100 font-semibold">{category}</div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-4 items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="leadName" className="text-right text-lg font-bold">
                Lead Name
              </Label>
              <Input
                id="leadName"
                placeholder="Navnoor Singh Bal"
                className="col-span-3 border-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              className="grid grid-cols-4 items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="leadEmail" className="text-right text-lg font-bold">
                Lead Email
              </Label>
              <Input
                id="leadEmail"
                type="email"
                placeholder="2022eeb1193@iitrpr.ac.in"
                className="col-span-3 border-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              className="grid gap-4 py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Label className="text-lg font-bold">Project Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-300">
                {!imageName ? (
                  <div className="space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-500">Upload a project image to showcase your work</p>
                    <UploadButton
                      endpoint="imageUploader"
                      onUploadBegin={() => setIsUploading(true)}
                      onClientUploadComplete={(res) => {
                        setIsUploading(false)
                        if (res && res.length > 0) {
                          setImage(res[0].key)
                          setImageName(res[0].name)
                          toast({
                            title: "Upload Complete",
                            description: "Your image has been uploaded successfully.",
                          })
                        }
                      }}
                      onUploadError={(error: Error) => {
                        setIsUploading(false)
                        toast({
                          title: "Upload Failed",
                          description: error.message,
                          variant: "destructive",
                        })
                      }}
                      className="ut-button:bg-blue-600 ut-button:hover:bg-blue-700 ut-button:transition-all ut-button:duration-300"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 bg-green-50 p-4 rounded-lg">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-700">{imageName}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImage("")
                        setImageName("")
                      }}
                      className="ml-2"
                    >
                      Change
                    </Button>
                  </div>
                )}

                {isUploading && (
                  <div className="mt-4 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Adding...
                </>
              ) : (
                <>Add Project</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddProjectButton

