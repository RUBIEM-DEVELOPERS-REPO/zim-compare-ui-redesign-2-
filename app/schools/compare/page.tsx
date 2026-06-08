import { redirect } from "next/navigation"

export default function SchoolsCompareBasePage({ searchParams }: { searchParams: { ids?: string } }) {
    if (searchParams.ids) {
        redirect(`/schools/compare/overview?ids=${searchParams.ids}`)
    }
    
    redirect("/schools")
}
