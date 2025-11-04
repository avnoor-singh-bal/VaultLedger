"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"

export function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChakraProvider value={defaultSystem}>
      {children}
    </ChakraProvider>
  )
}
