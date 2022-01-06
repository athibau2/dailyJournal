# Semester Project Proposal

My project will help people who struggle with journaling. I will build a website that prompts users each day to respond to a journal entry topic. Users can schedule when their prompts come, and they can view their responses in different formats. For example, they can sort by topic, by week/month/year, etc. They can also connect with other users and send each other prompts or share responses with each other. This will help people who don't know what to write about or who forget to write in a journal because it's tucked away and forgotten on a bookshelf.


# Domain Driven Design

## *Events*

* Account created
* Account deleted
* Account logged in
* Account logged out
* Password updated
* Prompt entry submitted
* Prompt entry deleted
* Prompt entry updated
* Entries viewed by topic
* Entries viewed by week
* Entries viewed by month
* Entries viewed by year
* Entry shared with friends
* Prompt shared with friends
* Prompt settings updated

## *Commands*

* createUser
* deleteUser
* userLogIn
* userLogOut
* updatePassword
* submitEntry
* deleteEntry
* updateEntry
* sortByTopic
* sortByWeek
* sortByMonth
* sortByYear
* shareEntry
* sharePrompt
* updatePromptSettings

## *Entities*

### Account

* User id (email/username)
* Name (chosen by user)
* Password (chosen by user)
* Session (Logged in or out)

### Entry

* Id (auto generated)
* Text
* Shared status (shared/not shared)
* Date

## *Value Objects*

### Prompt

* Topic
* Text
* Id

### Connections

* Other friends (connected or not/removable)
