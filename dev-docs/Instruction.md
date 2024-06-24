# VerseNetwork Instructions

Get started with VerseNetwork. Following the steps below to start development and running.


## Installation guide

1. Clone the repo
2. **Initialize Packages**
    - Navigate to the client project directory, and in the terminal run:
      ```
          cd client
      ```
      ```
          npm install
         ```
    - Navigate to the server project directory, and in the terminal run:
      ```
          cd server
      ```
      ```
          npm install
         ```
    - This step will download all necessary packages.

## Starting the Server  
1. Navigate to server directory: 
    ```
    cd server
    ```
2.  Start the server: 
    ```
    npm run dev
    ```

## Starting the Client
1. Navigate to client directory: 
    ```
    cd client
    ```
2. Start the client: 
    ```
    npm start
    ```
## Running Tests
Ensure Jest is installed (usually preloaded with React).
```
npm install --save-dev jest
```
### To run tests:
1. Navigate to: 'cd client'
2. Run the following command in the terminal
    ```
    npm test
    ```
3. If you want to test a specific folder then
    ```
    npm test "filename.test.js"
    ```
### To run tests with coverage:
1. Navigate to: 'cd client'
2. Run the following command in the terminal
    ```
    npm test -- --coverage
    ```
    If it only runs a few test files, hit a to run all tests.

3. If you want to test a specific folder then
    ```
    npm test "filename.test.js" -- --coverage
    ```

## Database Access
### MONGODB ACCESS IS STORED IN .ENV WHICH IS NOT INCLUDED IN THE REPO, PLEASE CONTACT ME FOR THE .ENV
1. **Install MongoDB**
- Download MongoDB from the official website or use a cloud-based solution.
2. **VS Code Extension**
- Install the MongoDB extension in Visual Studio Code for easy database management.
3. **Connect to MongoDB**
- Use the VS Code extension to connect to your MongoDB instance.

## Additional Notes
If having issues with index.html tailwindcss errors, refer to this link to fix. https://cssf1.com/how-to/fix-unknown-at-rule-tailwind-warning-vscode#:~:text=Fortunately%2C%20the%20officially%20recommended%20and,be%20treated%20as%20tailwindcss%20files.&text=Type%20"file%20assoc"%20into%20the,settings%20and%20you%20are%20done.

