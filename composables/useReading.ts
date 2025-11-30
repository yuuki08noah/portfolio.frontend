import type { Book, ReadingNote, ReadingGoal } from '~/types'

export const useReading = () => {
  const { get, post, put, del, getLocalized } = useApi()

  const fetchBooks = async (status?: Book['status']) => {
    const endpoint = status ? `/reading/books?status=${status}` : '/reading/books'
    return await getLocalized<{ data: Book[] }>(endpoint, false)
  }

  const fetchBook = async (id: string) => {
    return await getLocalized<{ data: Book }>(`/reading/books/${id}`, false)
  }

  const createBook = async (book: Partial<Book>) => {
    return await post<{ data: Book }>('/api/v1/reading/books', book)
  }

  const updateBook = async (id: string, updates: Partial<Book>) => {
    return await put<{ data: Book }>(`/api/v1/reading/books/${id}`, updates)
  }

  const deleteBook = async (id: string) => {
    return await del<{ success: boolean }>(`/api/v1/reading/books/${id}`)
  }

  const fetchReadingStats = async () => {
    return await getLocalized<{ data: any }>('/reading/stats', false)
  }

  const fetchReadingGoals = async () => {
    return await getLocalized<{ data: ReadingGoal[] }>('/reading/goals', false)
  }

  const createReadingGoal = async (goal: Partial<ReadingGoal>) => {
    return await post<{ data: ReadingGoal }>('/api/v1/reading/goals', goal)
  }

  return {
    fetchBooks,
    fetchBook,
    createBook,
    updateBook,
    deleteBook,
    fetchReadingStats,
    fetchReadingGoals,
    createReadingGoal
  }
}
