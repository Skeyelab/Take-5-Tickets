[![Stories in Ready](https://badge.waffle.io/Skeyelab/Take-N-Tickets.png?label=ready&title=Ready)](https://waffle.io/Skeyelab/Take-N-Tickets)

![Image](<http://cl.ly/image/2C323u2R1o24/Image%202015-03-20%20at%202.53.19%20PM.png>)

Take next X Tickets
-------------------

This Zendesk app adds a button to the sidebar in ticket view that assigns a customizable
number of tickets to the signed in agent.



### Settings

-   Quantity (Int) - The number of tickets assigned when clicking “Go!"

-   Pages (Int) - To help prevent agents from taking tickets from each other, the app will pull tickets from a random page number in the view. Pages may be 1 thru this setting. For example, if you enter 3, the agent will get 5 tickets.  All 5 will be from either page 1, page 2 or page 3.

-   Menu Config (JSON) - Configures the menu.  Use the format below.

```json
{
  "views": [
    {
      "label": "Unassigned Fresh Tix",
      "view": 45959723
    },
    {
      "label": "Unassigned BBQ",
      "view": 46327813
    }
  ]
}
```

### [Changelog](https://github.com/Skeyelab/Take-5-Tickets/blob/master/CHANGELOG.md)
