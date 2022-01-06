# Semester Project Proposal

My project will help people who struggle with journaling. I will build a website that prompts users each day to respond to a journal entry topic. Users can schedule when their prompts come, and they can view their responses in different formats. For example, they can sort by topic, by week/month/year, etc. They can also connect with other users and send each other prompts or share responses with each other. This will help people who don't know what to write about or who forget to write in a journal because it's tucked away and forgotten on a bookshelf.


# Domain Driven Design

## *Events*

* Account created
* Account deleted
* Account logged in
* Account logged out
* Password updated
* Prompt response submitted
* Prompt response deleted
* Prompt response updated
* Responses viewed by topic
* Responses viewed by week
* Responses viewed by month
* Responses viewed by year
* Response shared with friends
* Prompt shared with friends
* Prompt settings updated

## *Commands*

* createUser
* deleteUser
* userLogIn
* userLogOut
* updatePassword
* submitResponse
* deleteResponse
* updateResponse
* sortByTopic
* sortByWeek
* sortByMonth
* sortByYear
* shareResponse
* sharePrompt
* updatePromptSettings

## *Entities*

### Account

* User id (email/username)
* Name (chosen by user)
* Password (chosen by user)
* Session (Logged in or out)

### Response

* Response id (date? how to keep track?)
* Response text
* Shared status (shared/not shared)

### Connections

* Other friends (connected or not/removable)

## *Value Objects*

### Prompt

* Topic
* Text
* Id
