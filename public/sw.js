
self.addEventListener('push', function (e) {
    console.log('inside')
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    if (e.data) {
        console.log('resr')
        var msg = e.data.json();
        console.log(msg)
        e.waitUntil(self.registration.showNotification(msg.title, {
            body: msg.body,
            icon: msg.icon,
            actions: msg.actions
        }));
    }
});

self.addEventListener('notificationclick', function (event) {
    // Define the URL to open when the notification is clicked
    var url = 'https://www.google.com';

    event.notification.close();

    // Open the app or specific page
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no window/tab is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
self.addEventListener('fetch', (event) => {
    console.log('hello'),
        event.respondWith(
            // Try to fetch the request from the network
            fetch(event.request).then(function (response) {
                console.log('inside fetch in service worker', event.request)
                // If successful, clone the response and cache it
                if (response.status === 200) {
                    var responseToCache = response.clone();
                    caches.open('my-new').then(function (cache) {
                        cache.add(event.request, responseToCache);
                    });
                }
                return response;
            }).catch(async (error) => {
                console.log(error);
                // If the network request fails, try to get it from the cache
                const cachedResponse = await caches.match(event.request);
                // If the resource is in the cache, return it
                if (cachedResponse) {
                    return cachedResponse;
                } else if (event.request.mode === 'navigate') {
                    // If the request is a navigation request, serve the custom offline page
                    return caches.match('/views/OfflinePage.vue');
                }
            })
        );
});


