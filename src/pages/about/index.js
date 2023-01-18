import React from "react";
import Layout from "../../components/layout";
import Seo from "../../components/seo";

import { TlDr } from "../../styles/pages/about/about-styles";

const About = () => {
  const urls = {
    friends: (
      <a
        href="https://en.wikipedia.org/wiki/Friends"
        target="_blank"
        rel="noreferrer"
      >
        Friends
      </a>
    ),
    iRacing: (
      <a href="https://www.iracing.com/" target="_blank" rel="noreferrer">
        iRacing
      </a>
    ),
    bigFour: (
      <a
        href="https://en.wikipedia.org/wiki/Big_Four_accounting_firms"
        target="_blank"
        rel="noreferrer"
      >
        Big Four
      </a>
    ),
    adnBike: (
      <a
        href="https://adnbike.itpartner.cl/login"
        target="_blank"
        rel="noreferrer"
      >
        AdnBike
      </a>
    ),
    casinoEnjoy: (
      <a href="https://www.enjoy.cl/#/home" target="_blank" rel="noreferrer">
        Casino Enjoy
      </a>
    ),
    uChile: (
      <a
        href="https://portaluchile.uchile.cl/"
        target="_blank"
        rel="noreferrer"
      >
        Universidad de Chile
      </a>
    ),
    dataScienceUChile: (
      <a
        href="https://www.dcc.uchile.cl/educacion-continua/diplomas/ciencia-ingenieria-datos"
        target="_blank"
        rel="noreferrer"
      >
        Data Science diploma
      </a>
    ),
  };

  return (
    <Layout>
      <div>
        <div>
          {/* WELCOME SECTION */}
          <div>
            <h3>Welcome!</h3>
            <p>
              As you may have read, my name is{" "}
              <strong>Simón Muñoz Saavedra</strong>. I'm a Computer Engineer
              from Chile. I'm a big fan of {urls.friends}, and I like a lot
              simRacing in {urls.iRacing} (currently building my race rig). I
              have 3 dogs and 2 cats, actually you can see one of my dogs in the
              home page image
            </p>
            <p>
              I created this site to have a personal space to showcast my
              projects, share my likeings, and also learn. I believe that, if
              you can't explain something you probably don't fully understand
              it.
            </p>
            <p>
              Nowadays I'm fully dedicated to comeback to Web Development. I'm
              person that discover his path career late so, I'm working hard to
              achieve my goal, and I want that this site proves my
              determination.
            </p>
          </div>
          {/* TL:DR */}

          <TlDr>
            <h6>TL;DR</h6>
            <p>
              Computer Engineer that in the past few years have been working in
              Business Intelligence positions, that wants to return to Web
              Development.
            </p>
          </TlDr>

          {/* HISTORY SECTION */}
          <div>
            <h5>A little bit of History</h5>
            <p>
              I always liked computers, so for me the career choice was pretty
              obvious, after finish my Computer Engineer studies I wanted to
              check a different career path from development. So luckily (or
              not) I landed a job at a Big Consulting company (one of the{" "}
              {urls.bigFour}) in which I worked in a PMO team, long story short
              I quit after 8 month because I believe that filling a excel sheet
              doesn't have much to do with Computer Engineer.
            </p>
            <p>
              After that I embark myself in the freelance world (best thing
              ever) as a Web Developer in which I worked in two websites:
            </p>
            <ul>
              <li>
                {urls.adnBike}: A social/ecommerce website in which you can
                publish your bicicle for sell or you can post your bicicle if it
                was stolen (I actually learn that every bicicle frame has an
                unique ID).
              </li>
              <li>
                Socich: A website for the Chilean Society of Surgeons. I was
                able to finish this website because of some differences between
                my client and me.
              </li>
            </ul>
            <p>
              Then I realize that, working as freelance was really good, but
              also I didn't consider that I have to pay for my health plan and
              put money for my retirement fund so, I decided to getback to a
              usual office work, and landed in {urls.casinoEnjoy} as a Developer
              Analyst. There I worked developing an internal website for
              managing marketing campaigns. Sadly, my team was fired (yeah, me
              included) because they reubicate the team in another Country
            </p>
            <p>
              Here is where thing go weird, because my next job wasn't about web
              development, but involves working a lot with databases and python.
              It was fun, and a certain point I decided that probably I should
              study more about this topic, maybe get a diploma in Data Science,
              so I did. I enroll to a {urls.dataScienceUChile} at {urls.uChile}{" "}
              thinking that this would improve my career. But at the end I
              wasn't able to land a job as a Data Scientist (every job offer
              requires 3+ years of exp and other things like, unicorn blood)
            </p>
            <p>
              Nowadays, and probably after gain some maturity, I realize that
              the path that I took is not for me, I miss working with tech, or
              talking with tech people in a job enviroment. Currenly my work is
              based on make sure that a query runs, and check that some numbers
              are correct, It's like my first job.
            </p>
          </div>
          {/* FUTURE AND GOALS SECTION */}
          <div>
            <h5>The Goal</h5>
            <p>
              My goal is to land a job as Front-end or Back-end developer, so in
              the future work as a Full-Stack developer
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;

export const Head = () => <Seo title="About" />;
