<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
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
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-toolbar-title v-if="user !== null && user !== undefined">
        {{user.firstname}} {{user.lastname}}
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',

  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
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
    logout() {
      this.$store.dispatch('accounts/logout')
    },

    loadEntries() {
      this.$store.dispatch('journal/loadEntries')
      this.$store.dispatch('journal/loadTopics')
    },

    loadShared() {
      
    }
  },

  computed: {
    user() {
      return JSON.parse(this.$store.state.accounts.user)
    }
  }
}
</script>
