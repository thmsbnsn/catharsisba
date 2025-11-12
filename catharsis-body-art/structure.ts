// structure.ts
import {StructureBuilder} from 'sanity/structure'
import {Card, Flex, Stack, Text, Box} from '@sanity/ui'

// Dashboard component
function DashboardWidget() {
  return (
    <Box padding={5}>
      <Stack space={5}>
        {/* Welcome Header */}
        <Card padding={4} radius={3} shadow={1} tone="primary">
          <Flex align="center" gap={3}>
            <Text size={4} weight="bold">
              👋 Welcome to Catharsis Body Art CMS
            </Text>
          </Flex>
        </Card>

        {/* Quick Stats */}
        <Flex gap={3} wrap="wrap">
          <Card padding={4} radius={3} shadow={1} flex={1} style={{minWidth: '200px'}}>
            <Stack space={3}>
              <Text size={1} muted>Active Artists</Text>
              <Text size={5} weight="bold">2</Text>
              <Text size={1}>Chris & Austin</Text>
            </Stack>
          </Card>
          
          <Card padding={4} radius={3} shadow={1} flex={1} style={{minWidth: '200px'}}>
            <Stack space={3}>
              <Text size={1} muted>Blog Posts</Text>
              <Text size={5} weight="bold">📝</Text>
              <Text size={1}>Published content</Text>
            </Stack>
          </Card>
          
          <Card padding={4} radius={3} shadow={1} flex={1} style={{minWidth: '200px'}}>
            <Stack space={3}>
              <Text size={1} muted>Upcoming Events</Text>
              <Text size={5} weight="bold">📅</Text>
              <Text size={1}>Calendar items</Text>
            </Stack>
          </Card>
        </Flex>

        {/* Quick Links */}
        <Stack space={3}>
          <Text size={2} weight="semibold">Quick Actions</Text>
          <Flex gap={2} wrap="wrap">
            <Card
              as="a"
              href="https://catharsisba.vercel.app"
              target="_blank"
              padding={3}
              radius={2}
              shadow={1}
              style={{
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <Flex align="center" gap={2}>
                <Text size={2}>🌐</Text>
                <Text size={1}>View Live Site</Text>
              </Flex>
            </Card>
            
            <Card
              as="a"
              href="http://localhost:4321"
              target="_blank"
              padding={3}
              radius={2}
              shadow={1}
              style={{
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              <Flex align="center" gap={2}>
                <Text size={2}>💻</Text>
                <Text size={1}>Local Preview</Text>
              </Flex>
            </Card>
          </Flex>
        </Stack>

        {/* Tips */}
        <Card padding={4} radius={3} tone="caution">
          <Stack space={3}>
            <Text size={2} weight="semibold">💡 Pro Tips</Text>
            <Stack space={2}>
              <Text size={1}>• Use the Presentation tool for live preview editing</Text>
              <Text size={1}>• Click "Open Live Preview" to see changes instantly</Text>
              <Text size={1}>• Images are optimized automatically for web performance</Text>
              <Text size={1}>• All content updates appear on the site immediately</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  )
}

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Dashboard
      S.listItem()
        .title('Dashboard')
        .icon(() => '🏠')
        .child(
          S.component()
            .component(DashboardWidget)
            .title('Dashboard')
        ),
      
      S.divider(),
      
      // Artists Section
      S.listItem()
        .title('Artists')
        .icon(() => '🎨')
        .child(
          S.documentList()
            .title('Artists')
            .filter('_type == "artist"')
            .defaultOrdering([{field: 'name', direction: 'asc'}])
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType('artist')
            )
        ),
      
      // Blog Section
      S.listItem()
        .title('Blog')
        .icon(() => '📝')
        .child(
          S.list()
            .title('Blog')
            .items([
              // All Posts
              S.listItem()
                .title('All Posts')
                .icon(() => '📄')
                .child(
                  S.documentList()
                    .title('All Blog Posts')
                    .filter('_type == "blogPost"')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              
              // Published Posts
              S.listItem()
                .title('Published')
                .icon(() => '✅')
                .child(
                  S.documentList()
                    .title('Published Posts')
                    .filter('_type == "blogPost" && publishedAt < now()')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              
              // Draft Posts
              S.listItem()
                .title('Drafts')
                .icon(() => '📝')
                .child(
                  S.documentList()
                    .title('Draft Posts')
                    .filter('_type == "blogPost" && publishedAt > now()')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                ),
              
              S.divider(),
              
              // Categories
              S.listItem()
                .title('Categories')
                .icon(() => '🏷️')
                .child(
                  S.documentList()
                    .title('Blog Categories')
                    .filter('_type == "blogCategory"')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
            ])
        ),
      
      // Events Section
      S.listItem()
        .title('Events')
        .icon(() => '📅')
        .child(
          S.list()
            .title('Events')
            .items([
              // Upcoming Events
              S.listItem()
                .title('Upcoming')
                .icon(() => '🔜')
                .child(
                  S.documentList()
                    .title('Upcoming Events')
                    .filter('_type == "event" && startDate >= now()')
                    .defaultOrdering([{field: 'startDate', direction: 'asc'}])
                ),
              
              // Past Events
              S.listItem()
                .title('Past Events')
                .icon(() => '📚')
                .child(
                  S.documentList()
                    .title('Past Events')
                    .filter('_type == "event" && startDate < now()')
                    .defaultOrdering([{field: 'startDate', direction: 'desc'}])
                ),
              
              S.divider(),
              
              // All Events
              S.listItem()
                .title('All Events')
                .icon(() => '📅')
                .child(
                  S.documentList()
                    .title('All Events')
                    .filter('_type == "event"')
                    .defaultOrdering([{field: 'startDate', direction: 'desc'}])
                ),
            ])
        ),
      
      // Reviews
      S.listItem()
        .title('Reviews')
        .icon(() => '⭐')
        .child(
          S.documentList()
            .title('Reviews & Testimonials')
            .filter('_type == "review"')
            .defaultOrdering([{field: 'publishedDate', direction: 'desc'}])
        ),
      
      S.divider(),
      
      // Settings Section
      S.listItem()
        .title('Settings')
        .icon(() => '⚙️')
        .child(
          S.list()
            .title('Site Settings')
            .items([
              // Global Settings (Singleton)
              S.listItem()
                .title('Global Settings')
                .icon(() => '🌐')
                .child(
                  S.document()
                    .schemaType('globalSettings')
                    .documentId('globalSettings')
                    .title('Global Settings')
                ),
              
              S.divider(),
              
              // Page Settings
              S.listItem()
                .title('Page Settings')
                .icon(() => '📄')
                .child(
                  S.list()
                    .title('Page Settings')
                    .items([
                      S.listItem()
                        .title('Homepage')
                        .icon(() => '🏠')
                        .child(
                          S.documentList()
                            .title('Homepage Settings')
                            .filter('_type == "pageSettings" && route == "index"')
                        ),
                      S.listItem()
                        .title('Artists Page')
                        .icon(() => '🎨')
                        .child(
                          S.documentList()
                            .title('Artists Page Settings')
                            .filter('_type == "pageSettings" && route == "artists"')
                        ),
                      S.listItem()
                        .title('Gallery Page')
                        .icon(() => '🖼️')
                        .child(
                          S.documentList()
                            .title('Gallery Page Settings')
                            .filter('_type == "pageSettings" && route == "gallery"')
                        ),
                      S.listItem()
                        .title('All Page Settings')
                        .icon(() => '📋')
                        .child(
                          S.documentList()
                            .title('All Page Settings')
                            .filter('_type == "pageSettings"')
                            .defaultOrdering([{field: 'route', direction: 'asc'}])
                        ),
                    ])
                ),
            ])
        ),
    ])