<template>
    <LoadingGroup :pending="pending" :error="error">
        <n-grid :x-gap="60">
            <n-grid-item :span="6">
                <n-scrollbar style="height:450px;" class="bg-white rounded shadow mb-5">
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
            </n-grid-item>
            <n-grid-item :span="10">
                <n-card>
                    <NuxtPage :page-key="pageKey" @mouseup="handleMouseUp" @input="handlePageInput" />
                </n-card>
            </n-grid-item>
        <n-grid-item :span="8">

      
    <n-collapse>
    <n-collapse-item title="张三" name="1">
      一周小结：行动是打破平庸最好的回击
      <template #header-extra>
        本周工作日工作时长：58 小时
      </template>
    </n-collapse-item>
    <n-collapse-item title="李四" name="2">
      一周小结：勤奋是获取成功的唯一捷径
      <template #header-extra>
        本周工作日工作时长：62 小时
      </template>
    </n-collapse-item>
    <n-collapse-item name="3">
      <n-text type="error">
        一周小结：生产队的驴都不敢这么休息，建议优化
      </n-text>
      <template #header>
        <n-text type="error">
          王五
        </n-text>
      </template>
      <template #header-extra>
        <n-text type="error">
          本周工作日工作时长：45 小时
        </n-text>
      </template>
    </n-collapse-item>
  </n-collapse>
   


        

        <n-dialog v-model:visible="dialogVisible" title="AI提问" position="right">
          <div contentEditable="true" ref="editableText" class="editable-text" style="border: 2px solid black; box-shadow: 0 0 10px black; font-size: 1.5em; transition: box-shadow 0.5s ease;" @input="handleInput ">{{ userInput }}</div>
          <div class="flex justify-end mt-4">
            <n-button type="primary" @click="submitInput">Submit</n-button>
            <n-button type="default" @click="clearInput">Clear</n-button>
          </div>
        </n-dialog>
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

  const userInputs = ref([])  // Array to store user inputs
  const userInput = ref('')
  
  // Change your submit function to add the input to the array
  const submitInput = () => {
    if (userInput.value.trim() !== '') {
      userInputs.value.push(userInput.value)
      userInput.value = ''
      dialogVisible.value = false
    }
  }
  
  const editableText = ref(null)
  const dialogVisible = ref(false)

  let pageInput = ref('')
  const dialogRight = ref('20px') // Adjust the value as per your layout

  // Method to open the dialog
  const openDialog = () => {
    dialogVisible.value = true
  }

  const handleMouseUp = () => {
    const selectedText = window.getSelection().toString().trim()
    if (selectedText) {
      //dialogVisible.value = false
      userInput = selectedText
      //dialogVisible.value = true
    }
  }

  const handlePageInput = (event) => {
    pageInput = event.target.textContent
  }

  const handleDialogInput = (event) => {
    userInput = event.target.textContent
  }
  const clearInput = () => {
        editableText.value.innerText = ''
        userInput.value = ''
        pageInput = ''
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