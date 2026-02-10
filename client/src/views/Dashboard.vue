<template>
  <div class="p-8 max-w-7xl mx-auto">
    <!-- Header Card -->
    <div class="bg-gray-800 rounded-xl p-6 shadow-lg mb-8 flex justify-between items-center border border-gray-700">
      <div class="flex items-center space-x-4">
        <div class="text-yellow-400">
          <!-- Folder Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
            <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white">File Browser</h1>
          <p class="text-gray-400 text-sm">Securely manage and preview your files</p>
          <p class="text-gray-500 text-xs mt-1">Signed in as user@example.com</p>
        </div>
      </div>
      <button @click="logout" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
        Logout
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Upload Card -->
      <div 
        @click="$router.push('/upload')"
        class="bg-gray-800 rounded-xl shadow-lg cursor-pointer hover:bg-gray-750 transition duration-200 border border-gray-700 overflow-hidden group"
      >
        <div class="p-8">
          <div class="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
            <!-- Upload Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-blue-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Upload File</h2>
          <p class="text-gray-400">Add new files to your storage</p>
        </div>
        <div class="bg-gray-750 p-4 border-t border-gray-700 group-hover:bg-gray-700 transition">
          <span class="text-blue-400 font-semibold group-hover:text-blue-300">Choose File</span>
          <div class="h-1 bg-blue-600 mt-2 rounded-full w-full"></div>
        </div>
      </div>

      <!-- Search Card -->
      <div 
        @click="$router.push('/search')"
        class="bg-gray-800 rounded-xl shadow-lg cursor-pointer hover:bg-gray-750 transition duration-200 border border-gray-700 overflow-hidden group"
      >
        <div class="p-8">
          <div class="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
            <!-- Search Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-purple-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Find Files</h2>
          <p class="text-gray-400">Search by name or GR number</p>
        </div>
        <div class="bg-gray-750 p-4 border-t border-gray-700 group-hover:bg-gray-700 transition">
          <span class="text-blue-400 font-semibold group-hover:text-blue-300">Search Files</span>
          <div class="h-1 bg-blue-600 mt-2 rounded-full w-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}
</script>
