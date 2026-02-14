"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import {
  Card,
  CardContent,
  CardHeader,
} from "@/src/components/ui/card"
import {
  Avatar,
  AvatarFallback,
} from "@/src/components/ui/avatar"
import { Badge } from "@/src/components/ui/badge"

import UsersFilters from "./UsersFilters"
import UsersPagination from "./UsersPagination"

interface User {
  auth_user_id: string
  profile_id: string | null
  display_name: string | null
  email: string
  auth_created_at: string
  bookmarkCount: number
}

interface Props {
  initialUsers: User[]
}

const USERS_PER_PAGE = 9

export default function UsersClient({ initialUsers }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [direction, setDirection] = useState(0)

  /* ================= FILTER + SORT ================= */
  const filteredUsers = useMemo(() => {
    let users = [...initialUsers]
    const search = searchQuery.trim().toLowerCase()

    if (search) {
      users = users.filter(
        (u) =>
          u.display_name?.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      )
    }

    if (startDate) {
      const start = new Date(startDate)
      users = users.filter(
        (u) => new Date(u.auth_created_at) >= start
      )
    }

    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      users = users.filter(
        (u) => new Date(u.auth_created_at) <= end
      )
    }

    users.sort((a, b) => {
      switch (sortBy) {
        case "az":
          return (a.display_name ?? "").localeCompare(b.display_name ?? "")
        case "za":
          return (b.display_name ?? "").localeCompare(a.display_name ?? "")
        case "oldest":
          return (
            new Date(a.auth_created_at).getTime() -
            new Date(b.auth_created_at).getTime()
          )
        default:
          return (
            new Date(b.auth_created_at).getTime() -
            new Date(a.auth_created_at).getTime()
          )
      }
    })

    return users
  }, [initialUsers, searchQuery, sortBy, startDate, endDate])

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE
    return filteredUsers.slice(start, start + USERS_PER_PAGE)
  }, [filteredUsers, currentPage])

  const handleClear = () => {
    setSearchQuery("")
    setSortBy("newest")
    setStartDate("")
    setEndDate("")
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setDirection(page > currentPage ? 1 : -1)
    setCurrentPage(page)
  }

  return (
    <div className="space-y-8 sm:space-y-10 w-full">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Users
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          Manage and analyze user accounts.
        </p>
      </div>

      {/* ================= FILTERS ================= */}
      <UsersFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onClear={handleClear}
      />

      {/* ================= GRID WITH ANIMATION ================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: direction * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -30 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {paginatedUsers.map((user) => (
            <Link
              key={user.auth_user_id}
              href={`/users/${user.auth_user_id}`}
              className="min-w-0"
            >
              <Card className="group h-full transition hover:shadow-xl hover:-translate-y-1 cursor-pointer p-4 sm:p-5">

                <CardHeader className="flex flex-row items-center gap-4 p-0">

                  <Avatar className="shrink-0">
                    <AvatarFallback>
                      {(user.display_name?.[0] ?? user.email[0]).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <h2 className="font-semibold text-sm sm:text-base truncate">
                      {user.display_name ?? "No Profile"}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground break-all">
                      {user.email}
                    </p>
                  </div>

                </CardHeader>

                <CardContent className="flex justify-between items-center p-0 mt-4">

                  <Badge variant="secondary">
                    Active
                  </Badge>

                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                    {user.bookmarkCount} bookmarks
                  </span>

                </CardContent>

              </Card>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <UsersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={handlePageChange}
          direction={direction}
        />
      )}
    </div>
  )
}
