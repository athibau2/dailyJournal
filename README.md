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


# REST API Design

## *Endpoints*

| Description | URL Fragment | HTTP Method | Parameters | Representations |
| ----------- | ------------ | ----------- | ---------- | --------------- |
| create account | /accounts | POST |                   | Create Account  |
| delete account | /accounts/{userId} | DELETE | userId |                 |
| log in | /accounts/{userId}/login | PUT | userId      | Login           |
| log out | /accounts/{userId}/logout | PUT | userId    |                 |
| update password | /accounts/{userId}/settings | PUT | | Update Password |
| submit entry | /entries    | POST |                   | Submit Entry    |
| delete entry | /entries/{entryId} | DELETE | entryId  |                 |
| update entry | /entries/{entryId} | PUT | entryId     | Update Entry    |
| get tasks by topic | /entries/{topic} | GET | topic   | Sort by Topic   |
| get tasks by week | /entries/{date7days} | GET | date7days |            |
| get tasks by month | /entries/{month} | GET | month   |                 |
| get tasks by year | /entries/{year} | GET | year      |                 |
| share entry | /connections/{connectionId} | PUT | connectionId |        |
| share prompt | /connections/{connectionId} | PUT | connectionId |       |


## *Representations*

### Create Account
```json
{
    "firstName": "Andrew",
    "lastName": "Thibaudeau",
    "email": "example@email.com",
    "password": "fake-password"
}
```

### Login
```json
{
    "password": "fake-password"
}
```

### Update Password
```json
{
    "password": "new-password"
}
```

### Submit Entry
```json
{
    "prompt": "What is one thing you hope to accomplish within the next year and why?",
    "promptId": "ae5df8n432",
    "topic": "future goals",
    "entryId": "001",
    "text": "Become advanced in web development",
    "date": "01/11/2022",
    "shared": "false"
}
```

### Update Entry
```json
{
    "text": "Have developed 3 personal project websites so that I can show employers my work."
}
```

### Sort By Topic
```json
[
    {
        "prompt": "What is one thing you hope to accomplish within the next year and why?",
        "promptId": "ae5df8n432",
        "topic": "future goals",
        "entryId": "001",
        "text": "Have developed 3 personal project websites so that I can show employers my work.",
        "date": "01/11/2022",
        "shared": "false"
    },
    {
        "prompt": "What values do you hope you future family will have?",
        "promptId": "dk8ei3a239",
        "topic": "future goals",
        "entryId": "002",
        "text": "I want my family to regard other people with respect and be kind. I want my kids to instinctively stand up for their friends and serve others whenever someone needs help.",
        "date": "01/12/2022",
        "shared": "true"
    }
]
```