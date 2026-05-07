'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function ShopSetupPage() {
  const [shopName, setShopName] = useState('')
  const [description, setDescription] = useState('')
  const [themeColor, setThemeColor] = useState('#2563eb')
  const [saved, setSaved] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Shop Setup</h1>
        <p className="text-sm text-gray-500">Customise how your shop looks to customers</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Shop name */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-700">Basic information</h2>

          <div className="flex flex-col gap-2">
            <Label>Shop name</Label>
            <Input
              placeholder="e.g. Emmanuel's Store"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <textarea
              placeholder="Tell customers what your shop is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </Card>

        {/* Theme color */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-700">Theme color</h2>
          <p className="text-sm text-gray-500">This color will appear on your public shop page</p>

          <div className="flex items-center gap-4">
            <input
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border border-gray-200"
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-700">Selected color</p>
              <p className="text-sm text-gray-500">{themeColor}</p>
            </div>
            <div
              className="ml-auto w-24 h-12 rounded-lg"
              style={{ backgroundColor: themeColor }}
            />
          </div>
        </Card>

        {/* Preview */}
        {shopName && (
          <Card className="p-6 flex flex-col gap-3">
            <h2 className="text-base font-semibold text-gray-700">Preview</h2>
            <div
              className="rounded-lg p-4 text-white"
              style={{ backgroundColor: themeColor }}
            >
              <p className="font-bold text-lg">{shopName}</p>
              <p className="text-sm opacity-80">{description || 'No description yet'}</p>
            </div>
          </Card>
        )}

        {/* Save button */}
        <div className="flex items-center gap-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Save shop settings
          </Button>
          {saved && (
            <p className="text-green-600 text-sm font-medium">✅ Saved successfully!</p>
          )}
        </div>

      </form>
    </div>
  )
}