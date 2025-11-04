"use client"
import { motion } from "framer-motion";
import React from "react";
import { Box, ClipboardList, Database, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const FeaturesSecton = () => {
  return (
    <section className="px-4 md:px-6 py-12 md:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="grid gap-4 px-4 sm:px-6 md:px-10"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Key Features
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Streamline your inventory management with our comprehensive
              features
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturesSecton;

const features = [
  {
    title: "Real-time Tracking",
    description:
      "Monitor your inventory in real-time with accurate tracking and instant updates.",
    icon: Database,
  },
  {
    title: "User Management",
    description:
      "Manage user access and permissions with role-based authentication system.",
    icon: Users,
  },
  {
    title: "Asset Management",
    description:
      "Efficiently manage and track all assets with detailed categorization.",
    icon: Box,
  },
  {
    title: "Reports & Analytics",
    description:
      "Generate comprehensive reports and analyze inventory data with ease.",
    icon: ClipboardList,
  },
  {
    title: "Automated Alerts",
    description:
      "Get notified about low stock levels and important inventory updates.",
    icon: Database,
  },
];
