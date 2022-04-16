<template>
  <v-app>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="true"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          @click="item.click"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      color="#abddd0"
      :clipped-left="true"
      fixed
      app
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon 
            @click.stop="miniVariant = !miniVariant"
            v-on="on"
            v-bind="attrs"
          />
        </template>
        <span>{{miniVariant ? 'Expand' : 'Collapse'}}</span>
      </v-tooltip>
      <v-toolbar-title class="title">
        <span class="title-text">{{title}}&nbsp;</span>
        <v-icon class="icon" size="30" @click="toHome()">mdi-thought-bubble</v-icon>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-title style="font-family: Cochin;" v-if="user !== null && user !== undefined">
        {{user.firstname}} {{user.lastname}}
      </v-toolbar-title>
      <v-icon size="30" @click="toAccount()">mdi-account</v-icon>
    </v-app-bar>
    <v-main class="main">
      <v-container class="main">
        <Nuxt class="main" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',

  data () {
    return {
      fixed: true,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
        },
        {
          icon: 'mdi-format-list-bulleted',
          title: 'My Entries',
          to: '/entries',
          click: this.loadEntries
        },
        {
          icon: 'mdi-share-variant',
          title: 'Shared With Me',
          to: '/shared',
          click: this.loadShared
        },
        {
          icon: 'mdi-account-cog',
          title: 'Account',
          to: '/account',
          click: this.loadTime
        },
        {
          icon: 'mdi-logout-variant',
          title: 'Logout',
          click: this.logout
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Write Now'
    }
  },

  methods: {
    toAccount () {
      this.$router.push('/account')
    },

    toHome () {
      this.$router.push('/')
    },
    
    logout() {
      this.$store.dispatch('accounts/logout')
    },

    loadEntries() {
      this.$store.dispatch('journal/loadEntries')
      this.$store.dispatch('journal/loadTopics')
    },

    loadShared() {
      this.$store.dispatch('share/getSharedWithMe', { userid: this.user.id })
    },

    loadTime() {
      this.$store.dispatch('accounts/getNotifTime')
    }
  },

  computed: {
    user() {
      return JSON.parse(this.$store.state.accounts.user)
    }
  }
}
</script>

<style scoped>
@import '~/assets/style.css';


</style>
