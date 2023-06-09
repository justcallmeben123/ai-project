import axios from 'axios'

export default {
  data() {
    return {
      response: null,
    }
  },
  async created() {
    try {
      const res = await axios.get('http://127.0.0.1:8010/hello')
      this.response = res.data
    } catch (err) {
      console.error(err)
    }
  },
}