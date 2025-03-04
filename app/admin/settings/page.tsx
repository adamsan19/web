"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdmin } from "@/contexts/admin-context"
import { settingsManager } from "@/lib/settings"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import MetadataConfig from "@/components/admin/metadata-config"

export default function AdminSettings() {
  const { isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const [settings, setSettings] = useState(settingsManager.getSettings())
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }
  }, [isAuthenticated, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    settingsManager.updateSettings(settings)
    settingsManager.clearCache()
    toast.success("Settings updated successfully")
    router.refresh()
  }

  const handleReset = () => {
    settingsManager.resetSettings()
    settingsManager.clearCache()
    setSettings(settingsManager.getSettings())
    toast.success("Settings reset to defaults")
    router.refresh()
  }

  const handleMetadataChange = (pageType: string, field: string, value: string) => {
    setSettings({
      ...settings,
      metadata: {
        ...settings.metadata,
        [pageType]: {
          ...settings.metadata[pageType],
          [field]: value,
        },
      },
    })
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
          <CardDescription>Configure your website settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General Settings</TabsTrigger>
              <TabsTrigger value="metadata">Metadata Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Configuration</h3>
                <div className="space-y-2">
                  <Label htmlFor="apiUrl">API URL</Label>
                  <Input
                    id="apiUrl"
                    value={settings.apiUrl}
                    onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    value={settings.apiKey}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Site Configuration</h3>
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perPage">Items Per Page</Label>
                  <Input
                    id="perPage"
                    type="number"
                    value={settings.perPage}
                    onChange={(e) => setSettings({ ...settings, perPage: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="embedDomain">Embed Domain</Label>
                  <Input
                    id="embedDomain"
                    value={settings.embedDomain}
                    placeholder="https://example.com/e/"
                    onChange={(e) => setSettings({ ...settings, embedDomain: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultSort">Default Search Sort</Label>
                  <Select
                    value={settings.defaultSort}
                    onValueChange={(value) => setSettings({ ...settings, defaultSort: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sort option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="views">Most Viewed</SelectItem>
                      <SelectItem value="uploaded">Latest Uploaded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Cache Configuration (seconds)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="searchCache">Search Cache</Label>
                    <Input
                      id="searchCache"
                      type="number"
                      value={settings.cacheConfig.search}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          cacheConfig: {
                            ...settings.cacheConfig,
                            search: Number.parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fileListCache">File List Cache</Label>
                    <Input
                      id="fileListCache"
                      type="number"
                      value={settings.cacheConfig.fileList}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          cacheConfig: {
                            ...settings.cacheConfig,
                            fileList: Number.parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fileInfoCache">File Info Cache</Label>
                    <Input
                      id="fileInfoCache"
                      type="number"
                      value={settings.cacheConfig.fileInfo}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          cacheConfig: {
                            ...settings.cacheConfig,
                            fileInfo: Number.parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="folderListCache">Folder List Cache</Label>
                    <Input
                      id="folderListCache"
                      type="number"
                      value={settings.cacheConfig.folderList}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          cacheConfig: {
                            ...settings.cacheConfig,
                            folderList: Number.parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4">
              <div className="space-y-4">
                {Object.entries(settings.metadata).map(([pageType, config]) => (
                  <MetadataConfig key={pageType} pageType={pageType} config={config} onChange={handleMetadataChange} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button variant="ghost" onClick={handleLogout} className="mr-2">
              Logout
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                settingsManager.clearCache()
                toast.success("Cache cleared successfully")
              }}
            >
              Clear Cache
            </Button>
          </div>
          <div>
            <Button variant="outline" onClick={handleReset} className="mr-2">
              Reset to Defaults
            </Button>
            <Button onClick={handleSubmit}>Save Settings</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

