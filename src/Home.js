import React from 'react';
import './Home.css'; 

function Home() {
    return (
        <div className="home-container">
            <h2>Welcome Professor Lane!</h2>
            <p>Sorry this took so long. Let me give you a brief description of my website. Since the final project had to be a website, I decided to make a website that has a page for every one of my assignments for this class. As you can see, the nav bar holds tabs that will redirect you to other pages for each respective assignment. All it takes to start this file is the command npm start. Make sure you have npm installed. There is no server side.</p>
            <div className="assignments-container">
                <section className="assignment">
                    <h3>Assignment 1</h3>
                    <p>Assignment 1 was not bad, as you will see I just drew some simple shapes as outlined.</p>
                </section>
                <section className="assignment">
                    <h3>Assignment 2</h3>
                    <p> Will soon be implemented.</p>
                </section>
                <section className="assignment">
                    <h3>Assignment 3</h3>
                    <p>Implementing the logic was not too bad but getting a new image and generating the dots to land on random parts within the graph was a challenge, and it still does not work too well with the Bar Charts, not sure why. I did implement the reandom data change and everytime you press the respective button a new graph pops up with different positioned dots. The User can submit their guess to what the percentage difference of one the other is, and the Reported Percent, True Percent and Error are calculated below in a text area. Overall this assignment was very tough for me, and I stil have some errors in the operations.</p>
                </section>
                <section className="assignment">
                    <h3>Final Assignment</h3>
                    <p>I initially tried doing something completely differnt. I tried to make a spiderweb of nodes that you could move around and play with, and they would show similar data. But I couldn't really figure that out too much. The biggest thing I had to do for this assignment was data manipulation. I used real data from my MQP User Study from November and decided I was going to make a vizualization. I did explore a word cloud with the responses that most appeared, showing if users were more satisfied or dissatisfied with the application, but I decided against it. We had the participants use qualtrics to fill out 8 Question surveys, and each response came with a response ID and the time they began the User Study. Because of this, I decided to use the time given and plot each response as a node on a timeline where when hovered over, they would display information they carried like their ResponseID and answers to questions. I was able to put in functionality of zoom using the built in command, and also a pan feature both controlled by buttons. The pan feature was actuall simple because all it does is adjust the zoom reference by 50 to the left or right on the x axis. I included them as buttons because initially, the user would have to do it by zooming perpindicular on their keyboard so as to expand the timeline, and click and drag to pan. This gave me alot of issues so I decided using buttons would be much more intuitive for users.</p>
                </section>
            </div>
        </div>
    );
}

export default Home;
