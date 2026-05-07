import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export function useBikes() {
  const [bikes, setBikes] = useState([])
  const [familyBikes, setFamilyBikes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBikes = async () => {
      setLoading(true)

      // Fetch SOLO bikes
      const { data: soloData, error: soloError } = await supabase
        .from("bike_types")
        .select("*")
        .eq("type_isSolo")

      // Fetch FAMILY bikes
      const { data: familyData, error: familyError } = await supabase
        .from("bike_types")
        .select("*")
        .eq("type_isSolo")

      if (soloError) console.log("Solo error:", soloError)
      if (familyError) console.log("Family error:", familyError)

      setBikes(soloData || [])
      setFamilyBikes(familyData || [])

      setLoading(false)
    }

    fetchBikes()
  }, [])

  return { bikes, familyBikes, loading }
}