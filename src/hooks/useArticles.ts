import { useQuery } from "@tanstack/react-query";
import Papa from "papaparse";
import { Article } from "@/types/article";

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1ovVVDgKEyCHKT9iFVXCTab4pFf_hKAOfDAs0h2k96PA/export?format=csv";

export const useArticles = () => {
    return useQuery({
        queryKey: ["articles"],
        queryFn: async () => {
            try {
                const response = await fetch(GOOGLE_SHEET_URL);
                if (!response.ok) throw new Error("Failed to fetch Google Sheet data");

                const csvText = await response.text();

                return new Promise<Article[]>((resolve, reject) => {
                    Papa.parse(csvText, {
                        header: true,
                        skipEmptyLines: true,
                        complete: (results) => {
                            const parsedData = results.data as any[];

                            if (parsedData.length === 0) {
                                resolve([]);
                                return;
                            }

                            const transformedArticles: Article[] = parsedData.map((row) => {
                                // Generate excerpt from content if missing
                                const content = row.content || "";
                                const excerpt = content ? content.slice(0, 150) + (content.length > 150 ? "..." : "") : "No excerpt available";

                                // Helper to estimate read time
                                const wordCount = content.split(/\s+/).length;
                                const readTime = Math.max(1, Math.ceil(wordCount / 200)) + " min";

                                return {
                                    id: row.id || Math.random().toString(36).substr(2, 9),
                                    title: row.title || "Untitled Article",
                                    content: row.content || "",
                                    excerpt: row.excerpt || excerpt,
                                    category: row.category || "Uncategorized",
                                    ecosystem: row.ecosystem || "General",
                                    author: row.author || "Anonymous",
                                    date: row.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                                    image: row.image || "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80",
                                    readTime: row.readTime || readTime,
                                    views: row.views || "0",
                                    likes: parseInt(row.likes) || 0,
                                };
                            });

                            resolve(transformedArticles);
                        },
                        error: (error: any) => {
                            console.error("PapaParse error:", error);
                            reject(error);
                        },
                    });
                });
            } catch (error) {
                console.error("Fetch error:", error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
