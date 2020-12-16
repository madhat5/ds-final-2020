# data-structures final project

[temp sketch](url)
[aa sketch](url)
[blog sketch](url)

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

#### Next
- ALL
    - encode (ox)
    - `send/load from db (ox)`
        - debug password issue
        - push data to db's 
    - `get app.js working on aws (load files to AWS) (ox)`
        - move js to public folder?
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