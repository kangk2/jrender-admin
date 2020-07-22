<template>
  <div>
    <j-render :json-schema-api="jsonApi" :components="comps" @loadRemoteJsonSchema="jrenderLoad" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    // const jsonApi = this.$route.path + '/page_info'
    return {
      jsonApi: '/form/page_info',
      comps: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    jrenderLoad(page_api, page_json) {
      this.jsonSchema = JSON.stringify(page_json, null, 2)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  margin: 30px;
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
