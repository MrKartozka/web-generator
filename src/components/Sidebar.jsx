import React from "react";
import {
	Box,
	Toolbar,
	Drawer,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const drawerWidth = 240;

const Sidebar = ({ onTemplateChange }) => {
	return (
		<Box sx={{ display: "flex" }}>
			{/* <CssBaseline /> */}
			{/* <AppBar
				position="fixed"
				sx={{
					width: `calc(100% - ${drawerWidth}px)`,
					ml: `${drawerWidth}px`,
				}}
			>
				<Toolbar>
					<Typography variant="h6" noWrap component="div">
						Permanent drawer
					</Typography>
				</Toolbar>
			</AppBar> */}
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						boxSizing: "border-box",
					},
				}}
				variant="permanent"
				// anchor="left"
			>
				<Toolbar />
				<Divider />
				<List>
					{[
						{
							text: "Отчет по производственной практике",
							template: "report",
						},
						{ text: "Дневник практики", template: "diary" },
					].map((item, index) => (
						<ListItem key={item.text} disablePadding>
							<ListItemButton
								onClick={() => onTemplateChange(item.template)}
							>
								<ListItemIcon>
									{index % 2 === 0 ? (
										<InboxIcon />
									) : (
										<MailIcon />
									)}
								</ListItemIcon>
								<ListItemText primary={item.text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
		</Box>
	);
};

export default Sidebar;
