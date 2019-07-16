import daggy from "daggy";

export const Item = daggy.tagged("Item", ["title"]);

export const List = daggy.taggedSum("Page", {
  Empty: [],
  Initial: [],
  Items: [Item],
  NotFound: ["searchMessage"],
  FetchError: []
});

export const LIST_ITEMS = [
  { title: "Butter" },
  { title: "Bread" },
  { title: "Eggs" },
  { title: "Fish" },
  { title: "Cake" }
];
