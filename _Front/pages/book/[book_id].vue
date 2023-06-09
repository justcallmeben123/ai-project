<template>
  <LoadingGroup :pending="pending" :error="error">
      <n-grid :x-gap="60">
          <n-grid-item :span="6">
            <n-button @click="toggleDetailMenu">折叠/打开菜单</n-button>
              <n-scrollbar v-if="isDetailMenuVisible" style="height:600px;" class="bg-white rounded shadow mb-5">
                  <div class="flex flex-col items-center justify-center">
                      <n-image :src="data.detail.cover" width="60" height="80"
                      class="rounded shadow my-4"/>
                      <span class="text-sm">{{ data.detail.title }}</span>
                  </div>
                  
                  <DetailMenu class="mt-5">
                      <DetailMenuItem v-for="(item,index) in data.menus"
                      :key="index" :item="item" :index="index" @click="open(item.id)"
                      :active="activeId == item.id"/>

                      <Empty v-if="data.menus.length == 0" desc="暂无目录"/>
                  </DetailMenu>
              </n-scrollbar>
             
              <n-dialog v-if="dialogVisible" title="AI提问" >
        <div contentEditable="true" ref="editableText" class="editable-text" style="border: 2px solid black; box-shadow: 0 0 10px black; font-size: 1.5em; transition: box-shadow 0.5s ease;" @input="handleInput ">{{ userInput }}</div>
        <div class="flex justify-end mt-4">
          <n-button type="primary" @click="submitInput">Submit</n-button>
          <n-button type="default" @click="clearInput">Clear</n-button>
        </div>
      </n-dialog>
          </n-grid-item>
          <n-grid-item :span="10">
              <n-card>
                  <NuxtPage :page-key="pageKey" @mouseup="handleMouseUp" @input="handlePageInput" />
              </n-card>
          </n-grid-item>
      
      <n-grid-item :span="8">


        <div>
  <input v-model="question" type="text" placeholder="Enter your question here" />
  <button @click="askQuestion">Ask Question</button>
    <div v-if="response">
      <p>Response: {{ response }}</p>
    </div>
      </div>
      
       


      <n-collapse :accordion="true">
      <n-collapse-item
        v-for="(item, index) in listItems"
        :key="index"
        :title="item.title"
      >
       <textarea v-model="item.content" style="width: 100%;"></textarea> 
        <template #header-extra>
          <n-button @click="addToDialog(item.title)">提问</n-button>
          <n-button type="error" @click="removeFromList(index)">删除</n-button>
        </template>
        
      </n-collapse-item>
    </n-collapse>


      
      </n-grid-item>
  </n-grid>
  </LoadingGroup>
</template>


<script setup>
  import {
      NGrid,
      NGridItem,
      NCard,
      NScrollbar,
      NImage,
      NDialog,
      NInput,
      NCollapse,
      NButton,
      NCollapseItem,
      NText
  } from "naive-ui"

 
import { ref } from 'vue'
import axios from 'axios'

const question = ref('') 
const response = ref('')

const askQuestion = async () => {
  try {
    const token = '1'
    const id = 0
    const res = await axios.post('http://127.0.0.1:8010/accllm', {
        id:id,
        text: question.value,
      },
      {
          headers: {
            token: token
          },
        }
    )
    response.value = res.data
  } catch (err) {
    console.error('Error sending question', err.response.data)
  }
}

const isDetailMenuVisible = ref(true); 
const userInputs = ref([])  // Array to store user inputs
const userInput = ref('')
const listItems = ref([])
const editableText = ref(null)
const dialogVisible = ref(false)
let pageInput = ref('')
const dialogRight = ref('20px') // Adjust the value as per your layout


//显示菜单栏
const toggleDetailMenu = () => {
  isDetailMenuVisible.value = !isDetailMenuVisible.value;
  dialogVisible.value = !dialogVisible.value;
}


// Change your submit function to add the input to the array
const submitInput = () => {
  if (userInput.value.trim() !== '') {
    userInputs.value.push(userInput.value)
    userInput.value = ''
  }
}


// Method to open the dialog
const openDialog = () => {
  dialogVisible.value = true
}

const handleMouseUp = () => {
const selection = window.getSelection()
if (selection.rangeCount) {
  const range = selection.getRangeAt(0)
  const selectedText = range.toString().trim()
  if (selectedText) {
    const highlightSpan = document.createElement('span')
    highlightSpan.className = 'highlight' // 添加 highlight 类
    highlightSpan.textContent = selectedText

    range.deleteContents() // 删除原选中的内容
    range.insertNode(highlightSpan) // 插入新的 span 元素
  
    const num = 0
    const newItem = {
        title: selectedText ,
        content:'1',
        extra: '点击提问'
      }
    listItems.value.push(newItem)
    

    userInput.value = selectedText
  }
}
}

const handlePageInput = (event) => {
  pageInput = event.target.textContent
}
const addToDialog = (text) => {
    userInput += text
    dialogVisible.value = false
  }

const handleDialogInput = (event) => {
  userInput = event.target.textContent
}
const clearInput = () => {
      editableText.value.innerText = ''
      userInput.value = ''
      pageInput = ''
  }

const removeFromList = (index) => {
    listItems.value.splice(index, 1)
  }

  const route = useRoute()
  const pageKey = computed(()=>route.fullPath)
  const { book_id,id } = route.params
  const activeId = ref(id)
  
  const {
      data,
      error,
      pending
  } = await useBookMenusApi(book_id)

  const open = (d)=>{
      activeId.value = d
      navigateTo({
          params:{
              ...route.params,
              id:d
          }
      })
  }


  definePageMeta({
      middleware(to,from){
          const { book_id } = to.params
          if(isNaN(+book_id)){
              return abortNavigation("页面不存在")
          }
          return true
      }
  })
</script>

<style>
.highlight {
  background-color: yellow;
}
</style>