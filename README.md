![Image](<http://cl.ly/image/2C323u2R1o24/Image%202015-03-20%20at%202.53.19%20PM.png>)

Take next X Tickets
-------------------

This Zendesk app adds a button to the sidebar in ticket view that assigns a customizable
number of tickets to the signed in agent.



### Settings

-   Quantity (Int) - The number of tickets assigned when clicking “Go!"

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
