const {  
    client,
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
    getAllTags,
    createTags,
    createPostTag,
    addTagsToPost,
    getPostById
  } = require('./index');
  
  
  async function dropTables() {
    try {
      console.log("Starting to drop tables...");
  
      await client.query(`
      DROP TABLE IF EXISTS post_tags;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
      `);
  
      console.log("Finished dropping tables!");
    } catch (error) {
      console.error("Error dropping tables!");
      throw error;
    }
  }
  
  async function createTables() {
    try {
      console.log("Starting to build tables...");
  
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL,
          name varchar(255) NOT NULL,
          location varchar(255) NOT NULL,
          active boolean DEFAULT true
        );
        CREATE TABLE posts (
          id SERIAL PRIMARY KEY,
          "authorId" INTEGER REFERENCES users(id),
          title varchar(255) NOT NULL,
          content TEXT NOT NULL,
          active BOOLEAN DEFAULT true
        );
        CREATE TABLE tags (
          id SERIAL PRIMARY KEY,
          name varchar(255) UNIQUE NOT NULL
        );
        create table post_tags (
          "postId" INTEGER REFERENCES posts(id),
          "tagId" INTEGER REFERENCES tags(id),
          UNIQUE ("postId", "tagId")
        );
      `);
  
      console.log("Finished building tables!");
    } catch (error) {
      console.error("Error building tables!");
      throw error;
    }
  }
  
  async function createInitialUsers() {
    try {
      console.log("Starting to create users...");
  
      await createUser({ 
        username: 'albert', 
        password: 'bertie99',
        name: 'Al Bert',
        location: 'Sidney, Australia' 
      });
      await createUser({ 
        username: 'sandra', 
        password: '2sandy4me',
        name: 'Just Sandra',
        location: 'Ain\'t tellin\''
      });
      await createUser({ 
        username: 'glamgal',
        password: 'soglam',
        name: 'Joshua',
        location: 'Upper East Side'
      });
  
      console.log("Finished creating users!");
    } catch (error) {
      console.error("Error creating users!");
      throw error;
    }
  }
  
  async function createInitialPosts() {
    try {
      const [albert, sandra, glamgal] = await getAllUsers();
  
      console.log("Starting to create posts...");
      await createPost({
        authorId: albert.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them."
      });
  
      await createPost({
        authorId: sandra.id,
        title: "How does this work?",
        content: "Seriously, does this even do anything?"
      });
  
      await createPost({
        authorId: glamgal.id,
        title: "Living the Glam Life",
        content: "Do you even? I swear that half of you are posing."
      });
      console.log("Finished creating posts!");
    } catch (error) {
      console.log("Error creating posts!");
      throw error;
    }
  }
  
  async function createInitialTags() {
    try {
      console.log("Starting to create tags...");
  
      const [happy, sad, inspo, catman] = await createTags([
        '#happy', 
        '#worst-day-ever', 
        '#youcandoanything',
        '#catmandoeverything'
      ]);
  
      const [postOne, postTwo, postThree] = await getAllPosts();
  
      await addTagsToPost(postOne.id, [happy, inspo]);
      await addTagsToPost(postTwo.id, [sad, inspo]);
      await addTagsToPost(postThree.id, [happy, catman, inspo]);
  
      console.log("Finished creating tags!");
    } catch (error) {
      console.log("Error creating tags!");
      throw error;
    }
  }
  
  async function rebuildDB() {
    try {
      client.connect();
   await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialPosts();
      await createInitialTags(); // new
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error;
    }
  }
    async function createInitialPostTags() {
    try {
    console.log("Starting to create post_tags...");
    
    const [post1, post2, post3] = await getAllPosts();
  const [tag1, tag2, tag3, tag4] = await getAllTags();
  
  await addTagsToPost(post1.id, [tag1.id, tag2.id]);
  await addTagsToPost(post2.id, [tag2.id, tag3.id]);
  await addTagsToPost(post3.id, [tag3.id, tag4.id]);
  
  console.log("Finished creating post_tags!");
  } catch (error) {
    console.error("Error creating post_tags!");
    throw error;
    }
    }
    
    async function testDB() {
    try {
    console.log("Starting to test database...");
    console.log("Calling getAllUsers");
  const users = await getAllUsers();
  console.log("Result:", users);
  
  console.log("Calling updateUser on users[0]");
  const updateUserResult = await updateUser(users[0].id, {
    name: "Newname Sogood",
    location: "Lesterville, KY"
  });
  console.log("Result:", updateUserResult);
  
  console.log("Calling getAllPosts");
  const posts = await getAllPosts();
  console.log("Result:", posts);
  
  console.log("Calling updatePost on posts[0]");
  const updatePostResult = await updatePost(posts[0].id, {
    title: "New Title",
    content: "Updated Content"
  });
  console.log("Result:", updatePostResult);
  
  console.log("Calling getUserById with 1");
  const getUserByIdResult = await getUserById(1);
  console.log("Result:", getUserByIdResult);
  
  console.log("Calling getPostsByUser with 1");
  const getPostsByUserResult = await getPostsByUser(1);
  console.log("Result:", getPostsByUserResult);
  
  console.log("Calling getPostById with 1");
  const getPostByIdResult = await getPostById(1);
  console.log("Result:", getPostByIdResult);
  
  console.log("Finished testing database!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
    }
    }
    
    rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());
  