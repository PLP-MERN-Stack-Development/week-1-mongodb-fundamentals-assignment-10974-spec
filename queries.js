const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb://localhost:5000"; 
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const database = client.db("bookstore");
        const books = database.collection("books");

   
        const insertResult = await books.insertOne({
            title: "New Book",
            author: "Author Name",
            price: 19.99,
            stock: 10
        });
        console.log("Inserted document:", insertResult.insertedId);

        // Find
        const foundBooks = await books.find({ author: "Author Name" }).toArray();
        console.log("Found books:", foundBooks);

        // Update
        const updateResult = await books.updateOne(
            { title: "New Book" },
            { $set: { price: 24.99 } }
        );
        console.log("Updated documents:", updateResult.modifiedCount);

        // Delete
        const deleteResult = await books.deleteOne({ title: "New Book" });
        console.log("Deleted documents:", deleteResult.deletedCount);

        // Task 2: Advanced Queries
      
        const filteredBooks = await books.find({
            price: { $gt: 20 },
            stock: { $gte: 5 }
        }).project({ title: 1, author: 1, _id: 0 }).toArray();
        
        // Sorting
        const sortedBooks = await books.find()
            .sort({ price: -1 }) // Descending order
            .limit(5) // Top 5 most expensive
            .toArray();

        // Task 3: Aggregation Pipeline
        const aggregationResult = await books.aggregate([
            {
                $group: {
                    _id: "$author",
                    totalBooks: { $sum: 1 },
                    averagePrice: { $avg: "$price" }
                }
            },
            { $sort: { totalBooks: -1 } }
        ]).toArray();

        // Task 4: Indexing
        await books.createIndex({ title: 1 }); // Single field index
        await books.createIndex({ author: 1, price: -1 }); // Compound index

    } finally {
        await client.close();
    }
}

main().catch(console.error);
