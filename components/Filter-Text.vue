<template>
    <div>
        <span>Enter something</span>
        <input v-model="text" @input="$emit('updateLength', text.length)"/>
        Look here: {{myText}}
    </div>
</template>

<script>
export default {
  name: 'FilterText',

  data () {
    return {
        text: "Sample"
    }
  },

  props: {
    myText: String
  },

  methods: {

  },

  computed: {

  },
}
</script>

<style scoped>
input{
    border: solid black;
}
</style>
