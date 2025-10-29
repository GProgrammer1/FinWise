import { cssInterop, remapProps } from "nativewind";
import {
  Appbar,
  Button,
  Card,
  TextInput,
  List,
  Divider,
  Surface,
  Chip,
  Avatar,
  Badge,
  Snackbar,
  Dialog,
  Portal,
  Modal,
  Checkbox,
  RadioButton,
  Switch,
  ToggleButton,
  DataTable,
  BottomNavigation,
  Drawer,
  Icon,
} from "react-native-paper";

/** Basic mapping: className -> style */
cssInterop(Appbar, { className: "style" });
cssInterop(Appbar.Header, { className: "style" });
cssInterop(Appbar.Content, { className: "style" });
cssInterop(Appbar.Action, { className: "style" });
cssInterop(Appbar.BackAction, { className: "style" });

/** Button: needs multiple style targets */
cssInterop(Button, {
  className: "style", // outer container
  contentClassName: "contentStyle", // inner content (height/padding/row)
  labelClassName: "labelStyle", // text style
});

/** TextInput: map style + placeholder/selection colors */
cssInterop(TextInput, {
  className: "style",
  placeholderClassName: {
    target: false,
    nativeStyleToProp: { color: "placeholderTextColor" },
  },
  selectionClassName: {
    target: false,
    nativeStyleToProp: { color: "selectionColor" },
  },
});

/** Common surfaces & content */
cssInterop(Card, { className: "style" });
cssInterop(Card.Content, { className: "style" });
cssInterop(Card.Title, { className: "style" });
cssInterop(Card.Cover, { className: "style" });
cssInterop(Card.Actions, { className: "style" });

cssInterop(Surface, { className: "style" });
cssInterop(Divider, { className: "style" });

/** Lists */
cssInterop(List.Item, { className: "style" });
cssInterop(List.Section, { className: "style" });
cssInterop(List.Subheader, { className: "style" });
cssInterop(List.Accordion, { className: "style" });
cssInterop(List.Icon, { className: "style" });

/** Feedback & Avatars */
cssInterop(Snackbar, { className: "style" });
cssInterop(Dialog, { className: "style" });
cssInterop(Modal, { className: "style" });
cssInterop(Chip, { className: "style" });
cssInterop(Badge, { className: "style" });

cssInterop(Avatar.Icon, { className: "style" });
cssInterop(Avatar.Image, { className: "style" });
cssInterop(Avatar.Text, { className: "style" });

/** Selection controls */
cssInterop(Checkbox.Item, { className: "style" });
cssInterop(RadioButton.Item, { className: "style" });
cssInterop(Switch, { className: "style" });
cssInterop(ToggleButton, { className: "style" });
cssInterop(ToggleButton.Row, { className: "style" });

/** DataTable */
cssInterop(DataTable, { className: "style" });
cssInterop(DataTable.Header, { className: "style" });
cssInterop(DataTable.Title, { className: "style" });
cssInterop(DataTable.Row, { className: "style" });
cssInterop(DataTable.Cell, { className: "style" });
cssInterop(DataTable.Pagination, { className: "style" });

/** Navigation */
cssInterop(BottomNavigation, { className: "style" });
cssInterop(BottomNavigation.Bar, { className: "style" });

cssInterop(Drawer.Item, { className: "style" });
cssInterop(Drawer.Section, { className: "style" });
cssInterop(Drawer.CollapsedItem, { className: "style" });

/** Icons */

/** Example of adding extra className props for components with multiple style props */
remapProps(BottomNavigation, {
  className: "style",
  barClassName: "barStyle",
});
