"use client"
import { createContext, useContext } from "react"

const TokenContext = createContext<string | null>(null)
export const useToken = () => useContext(TokenContext)
export const TokenProvider = TokenContext.Provider
