"use client" // Mark this component as a Client Component

import { useState, useEffect } from "react"

const SomeClientComponent = () => {
  const [state, setState] = useState(false)

  useEffect(() => {
    // Your effect logic here
    console.log("Effect runs after render")
  }, [])

  return <div>Client Component</div>
}

export default SomeClientComponent

