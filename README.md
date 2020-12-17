# data-structures final project

Final project prototype links

Assign. 10-3 Time sensor:
https://madhat5.github.io/ds-final-2020/base_protype/sensor.html

Assign. 10-2 Process blog:
https://madhat5.github.io/ds-final-2020/base_protype/blog.html

Assign. 10-2 AA map:
https://madhat5.github.io/ds-final-2020/base_protype/aa.html

Repo:
https://github.com/madhat5/ds-final-2020


#### Overview
The goal of this project was to create 3 different apps:
    - a blog visualization, where a user inputs a number of variables (eg weight, hours of sleep, etc)
    - a temperature sensor guessing game, in which roommates guess the temperature based on set criteria (eg windows, cooking, etc), which is then displayed on a chart as 3 continuous data points
    - an alcoholics anonymous map app, displaying the nearest 3 or more (user input) meetings in a given area (user input)

The data was loaded to online databses (RDS and Dynamo); a request is then sent to retrieve and display the data.

Status:
    - process blog: 
        - data was retrieved from Dynamo, however issues loading to HTML through handlebars
        - is only working withstatic data, 
        - user inputs not yet built in
    - the temperature: 
        - is only displaying static data, 
        - user inputs not yet built in
    - aa map:
        - is only displaying static data, 
            - user inputs not yet built in

#### Next Steps
- ALL
    - encode (ox)
    - `send/load from db (ox)`
        - debug password issue
        - push data to db's 
    - `get app.js working on aws (load files to AWS) (ox)`
        - move js to public folder?
    - push working pages to aws/github
    - user inputs
- Blog
    - get date working on x axis (ox)
    - add legend (x)
    - serve db data instead of json
    - encode (title, summary, legend, etc) (ox)
- Sensor
    - viz w/ json data first (x)
    - get date working on x axis
    - serve db data instead of json
    - get user inputs + sensor api res
        - send {} to DB
    - encode (title, summary, legend, etc) (ox)
    - change visual?
        - box plot chart line chart to show error diff btw roommates (https://www.d3-graph-gallery.com/boxplot.html)
- Map
    - viz w/ json data first (x)
    - serve db data instead of json
    - encode (title, summary, legend, etc) (ox)

#### Summary: 

- What will the visualization look like? Will it be interactive? If so, how?
- How will the data need to be mapped to the visual elements?
- For that mapping, what needs to be done to the data? Be specific and clear. Will it require filtering, aggregation, restructuring, and/or something else? How will this be done?
- What is the default view (if any)?
- What assumptions are you making about the user?


#### Notes:

- AA map
    - finalize sketch (x)
    - double check data build (missed merging of AA + TAMU data?)
- Process blog
    - make new data in aws (from logbook) (x)
- Sensor data
    - debug saving data (o)
    - collect data (ox)
    - encode (popup dates, etc)


- Submission
    - github repo
    - screen cast guided tour
    - 
- removing all form AWS