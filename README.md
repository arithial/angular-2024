# BookClub

The BookClub is a test app, designed around the idea of providing a web interface for a book club.
The app is designed with the idea that people can add and vote on monthly books.
- The backend is designed to provide a graphQL API. It's incredibly basic and lacks a lot of internal checks.
- The frontend is the main focus, using(and learning) Angular to provide a valid frontend.
- The frontend uses [Open Library](https://openlibrary.org) API to visualise the book cover arts.
- The same API is also used to fetch book details via isbn.
- Books are added via isbn only. The rest is loaded dynamically.
- Book details and core app component should be the best examples, the rest are mostly view only displays, using multiple patterns to visualise the data.
- There are multiple ways to display different lists of books. each one display them differently, even if they are mostly the same.
  - All Books just displays them, in Display form, in a single flexible div.
  - Unfinished books are in a list and provide vote data, along with the option to vote/manipulate votes.
  - Finished books uses a grid layout
- Wacky means are used to provide ordering, because of backend inferiority(focus is frontend, not backend, so minimum time was spent).
- GraphGL generators are used to automatically generate the proper API and classes/types for both the backend and frontend.
- Backend lacks proper functionality to provide angular friendly auth tokenization and etc. This is the best 5 minutes of thoughts and implementation provided in terms of backend.

## Users:

### Guest
Guest uses can see the front page, which provides the currently selected book for reading(known as "Book of the Month") and the top 5 most voted for next books.
The guest also has access to the list of books and the login/register screens.

### Basic User
A basic user can vote for books, via thumbs up and down buttons. They can also clear their vote from the same component element.
A basic user also has access to book details, where they can see the book description, the biggest available cover art and participate in comments.
A user can edit and delete their own comments.
The backend, during initial table creation and etc will generate 30 basic users following the pattern of `testUser<number>` for username and `password<number>` for password, where `<number>` is between 0 and 29.
Each of these users also has 1 test comment on the Dune book and one random vote, biased to give an average vote of 70% approval for said book.

### Admin
There is a single admin in the system, which can be accessed via the `admin` username and `password` password.
The admin can edit and delete all the comments. The admin also has the single responsibility of finalizing the vote, so that a new book is chosen. That is done via the green thumbs up next to the Monthly Read.
This should be done semi-automatically by the backend, but the backend is not the focus, so this was done as a way to provide proper functionality, even if the backend is lacking.


## Currently Missing Functionality:
1. Automatic updating of votes. This requires the backend to support graphQL subscriptions, which it currently doesn't.
2. Admin User screen. Does not provide much use for the Angular learning atm, alongside with an ability for an admin to edit/delete users. Backend supports the functionality.
3. Improve error handling. It's very basic atm. and not all errors are visualised. Needs expanded error handling on backend to handle all possible problems in a valid way. For example, outside of parsing the message, there is no way to know if adding a book fails because of isbn or name.
4. Improve styling. As a backend development, the app screams "backend", even with my best attempt. Reason is simple, I think like a backend dev, thus I am biased to make things in a way that is backend dev friendly. Basic UI/UX design should be mostly maintained.
5. Make paginated screens use url params of some form, to allow for bookmarking(even though it's mostly useless)