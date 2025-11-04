"use client";

import { useEffect, useState } from "react";
import type { Admin, Project } from "@/models/models";
import AddProjectButton from "./addProjectButton";
import { CheckCircle, Trash2, Calendar, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { toast } = useToast();
  const user = useSelector((state: RootState) => state.UserData.user);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch categories
        const res = await fetch("/api/admin");
        const data = await res.json();
        const AdminsData = data.admins;
        const newCategories = [
          "Sample",
          ...AdminsData.map((admin: Admin) => admin.category),
        ];

        setCategories(["All", ...newCategories]);

        // Fetch inventory **after** categories are set
        const projectsData = await Promise.all(
          newCategories.map(async (category) => {
            const response = await fetch(`/api/projects?pn=${category}`);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.projects;
          })
        );

        setProjects(projectsData.flat());
      } catch (err) {
        console.error("Error fetching data:", err);
        toast({
          title: "Failed to load projects",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  // Deleting Project
  const deleteProject = async (project: Project) => {
    try {
      setLoading(true);
      await fetch("/api/projects", {
        method: "DELETE",
        body: JSON.stringify({
          category: project.category,
          _id: project._id,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });

      // Update local state
      setProjects(projects.filter((p) => p._id !== project._id));

      toast({
        title: "Project Deleted!",
        description: `${project.title} has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Failed to delete project",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Marking Project Complete
  const completedProject = async (project: Project) => {
    try {
      setLoading(true);
      await fetch("/api/projects", {
        method: "PUT",
        body: JSON.stringify({
          category: project.category,
          _id: project._id,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });

      // Update local state
      setProjects(
        projects.map((p) =>
          p._id === project._id
            ? { ...p, completed: true, endDate: new Date().toISOString() }
            : p
        )
      );

      toast({
        title: "Project Completed!",
        description: `${project.title} has been marked as completed.`,
      });
    } catch (error) {
      console.error("Error completing project:", error);
      toast({
        title: "Failed to update project",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter projects by category
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <div className="mx-auto px-4 py-12">
      <motion.div
        className="flex flex-col md:flex-row justify-between items-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 md:mb-0">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Projects Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Explore and manage all ongoing and completed projects
          </p>
        </div>

        {user.role !== 0 && (
          <AddProjectButton
            category={user.category}
            isSuperAdmin={user.role === 3}
          />
        )}
      </motion.div>

      {/* Category Filter */}
      <motion.div
        className="flex flex-wrap gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            className={`rounded-full px-4 py-2 transition-all duration-300 ${
              activeCategory === cat
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : "hover:border-blue-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </motion.div>

      {loading ? (
        <div className="w-full flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <AnimatePresence>
          {filteredProjects.length === 0 ? (
            <motion.div
              className="text-center py-16 bg-gray-50 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-2xl font-semibold text-gray-700">
                No projects found
              </h3>
              <p className="text-gray-500 mt-2">
                {activeCategory === "All"
                  ? "There are no projects available yet."
                  : `There are no projects in the ${activeCategory} category.`}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project: Project, index) => (
                <motion.div
                  key={project._id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={`https://utfs.io/f/${project.image}`}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={`${
                          project.completed
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        } px-3 py-1 text-xs font-medium rounded-full shadow-sm`}
                      >
                        {project.completed ? "Completed" : "Ongoing"}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 line-clamp-1">
                        {project.title}
                      </h2>

                      {user.role !== 0 && (
                        <div className="flex space-x-2">
                          {!project.completed && (
                            <motion.button
                              className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
                              onClick={() => completedProject(project)}
                              title="Mark as Complete"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <CheckCircle size={18} />
                            </motion.button>
                          )}

                          <Popover>
                            <PopoverTrigger asChild>
                              <motion.button
                                className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300"
                                title="Delete Project"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 size={18} />
                              </motion.button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 overflow-hidden border-none shadow-xl">
                              <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                  <h4 className="text-lg font-bold text-red-600">
                                    Delete Project
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold">
                                      {project.title}
                                    </span>
                                    ? This action cannot be undone.
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <Button
                                    onClick={() => deleteProject(project)}
                                    className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-300"
                                  >
                                    Delete
                                  </Button>
                                  <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors duration-300">
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mt-4">
                      <div className="flex items-center text-gray-600">
                        <Badge variant="outline" className="mr-2 bg-gray-50">
                          {project.category}
                        </Badge>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <a
                          href={`mailto:${project.leadEmail}`}
                          className="text-sm hover:text-blue-600 transition-colors duration-300"
                        >
                          {project.leadName} ({project.leadEmail})
                        </a>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm">
                          Started:{" "}
                          {new Date(project.startDate).toLocaleDateString()}
                        </span>
                      </div>

                      {project.completed && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm">
                            Completed:{" "}
                            {new Date(project.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <div
                        className={`w-full h-2 rounded-full ${
                          project.completed
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : "bg-gradient-to-r from-amber-400 to-amber-600"
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ProjectsSection;
