import { apiSlice } from "./apiSlice";

export const booksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: ({ language, seed, page, reviewCount, likes }) => ({
        url: "/api/books",
        method: "GET",
        params: { language, seed, page, reviewCount, likes },
      }),
    }),
  }),
});

export const { useGetBooksQuery } = booksApiSlice;
