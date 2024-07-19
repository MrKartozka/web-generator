import React, { useState } from "react";
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
	IconButton,
	Button,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const drawerWidth = 240;

const Sidebar = ({
	onTemplateChange,
	onDrawerToggle,
	setDiary,
	handlePrint,
}) => {
	const [open, setOpen] = useState(true);

	const handleDrawerToggle = () => {
		setOpen(!open);
		onDrawerToggle(!open);
	};

	return (
		<Box sx={{ display: "flex" }}>
			<Drawer
				variant="permanent"
				sx={{
					width: open ? drawerWidth : 50, // Минимальная ширина для отображения кнопки
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: open ? drawerWidth : 50,
						transition: "width 0.3s",
						boxSizing: "border-box",
						overflowX: "hidden", // Скрываем содержимое, когда панель узкая
					},
				}}
			>
				<Toolbar>
					<IconButton onClick={handleDrawerToggle}>
						{open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</Toolbar>
				{open && (
					<>
						<Divider />
						<List>
							{[
								{
									text: "Отчет по производственной практике",
									template: "report",
								},
								{ text: "Дневник практики", template: "diary" },
							].map((item, index) => (
								<ListItem
									key={index}
									disablePadding
									onClick={() => {
										if (item.template === "diary") {
											setDiary(true);
										} else if (item.template === "report") {
											setDiary(false);
										}
									}}
								>
									<ListItemButton
										onClick={() =>
											onTemplateChange(item.template)
										}
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
						<Divider />
						<Box sx={{ padding: 2 }}>
							<Button
								variant="contained"
								color="primary"
								fullWidth
								onClick={handlePrint}
							>
								Печать
							</Button>
						</Box>
					</>
				)}
			</Drawer>
		</Box>
	);
};

export default Sidebar;
