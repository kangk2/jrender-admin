<script type="text/jsx">
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  render() {
    return <div class='dashboard-container'>
      <div class='dashboard-text'>name: {this.name}</div>
    </div>
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
