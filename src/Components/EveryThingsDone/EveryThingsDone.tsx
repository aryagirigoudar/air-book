import Image from 'next/image'
import React from 'react'
import Done_Mark from "../../../assets/Done_Mark.svg"

export default function EveryThingsDone() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full rounded-[4px] bg-Background-primary py-5">
        <Image loading='lazy' src={Done_Mark} alt="Done"/>
        <p className="text-Text-light">You are good!<span className='block font-semibold'>No PO&apos;s found</span></p>
  </div>
  )
}
