<template>
  <div>
    <el-checkbox
      :checked="checked"
      :indeterminate="indeterminate"
      style="margin-right: 6px"
      :disabled="disabled"
      @change="this.checkAll"
    />
    {{selectLength === 0 ?
      `${allLength}项` :
      `${selectLength}/${allLength}项`
    }}
  </div>
  
</template>
<script>
export default {
  name: 'AllCheck',
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
    },
    direction: {
      type: String,
    },
    selectLength: {
      type: Number,
    },
    allLength: {
      type: Number,
    },
  },
  methods: {
    checkAll() {
      console.log(this.direction, this.type);
      this.$emit("onCheck", this.direction, this.type);
    }
  }
}
</script>
<style scoped>

</style>