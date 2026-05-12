import React, { useEffect, useMemo, useState } from 'react';
import './Home.css';
import { apibaseurl, callApi, imgurl } from '../lib';
import ProgressBar from './ProgressBar';

const fallbackMenus = [
    { mid: 1, icon: "dashboard.png", menu: "Dashboard" },
    { mid: 2, icon: "mytask.png", menu: "My Task" },
    { mid: 3, icon: "taskmanager.png", menu: "Task Manager" },
    { mid: 4, icon: "usermanager.png", menu: "User Manager" },
    { mid: 5, icon: "myprofile.png", menu: "My Profile" }
];

const Home = () => {
    const isElanAdmin = localStorage.getItem("username") === "elan77@gmail.com";
    const [fullname, setFullname] = useState("");
    const [isProgress, setIsProgress] = useState("");
    const [menuList, setMenuList] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(isElanAdmin ? "Roles" : "Dashboard");
    const [roleName, setRoleName] = useState("");
    const [menuName, setMenuName] = useState("");
    const [roles, setRoles] = useState([
        { role: 1, rolename: "User" },
        { role: 2, rolename: "Manager" },
        { role: 3, rolename: "Admin" }
    ]);
    const [allMenus, setAllMenus] = useState(fallbackMenus);
    const [users, setUsers] = useState([]);

    const visibleMenus = useMemo(() => {
        const list = menuList || [];
        if(!isElanAdmin || list.some((m) => m.menu === "Roles"))
            return list;

        return [...list, { mid: "roles", icon: "usermanager.png", menu: "Roles" }];
    }, [isElanAdmin, menuList]);

    function loadUinfo(res){
        setIsProgress(false);
        if(res.code != 200)
            return;
        setFullname(res.fullname);
        setMenuList(res.menulist || []);
    }

    async function requestApi(path, options = {}){
        const res = await fetch(apibaseurl + path, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("token") || "",
                ...(options.headers || {})
            }
        });

        if(!res.ok)
            throw new Error("Request failed");

        const data = await res.json();
        if(data.code && data.code !== 200)
            throw new Error(data.message || "Request failed");

        return data;
    }

    async function loadRoleManagerData(jwtToken){
        try{
            const headers = { "Token": jwtToken };
            const [rolesResponse, menusResponse] = await Promise.all([
                fetch(apibaseurl + "/authservice/roles", { headers }),
                fetch(apibaseurl + "/authservice/menus", { headers })
            ]);

            if(rolesResponse.ok){
                const data = await rolesResponse.json();
                setRoles(data.roles || data);
            }

            if(menusResponse.ok){
                const data = await menusResponse.json();
                setAllMenus(data.menus || data);
            }
        }catch{
            setAllMenus(fallbackMenus);
        }
    }

    async function loadUsers(){
        try{
            const data = await requestApi("/authservice/users");
            setUsers(data.users || []);
        }catch(err){
            console.error(err.message || "Users were not loaded.");
        }
    }

    async function addRole(){
        const name = roleName.trim();
        if(!name)
            return;

        const nextRole = roles.length ? Math.max(...roles.map((r) => Number(r.role))) + 1 : 1;
        const roleData = { role: nextRole, rolename: name };

        try{
            await requestApi("/authservice/roles", {
                method: "POST",
                body: JSON.stringify(roleData)
            });
            setRoleName("");
            await loadRoleManagerData(localStorage.getItem("token") || "");
        }catch(err){
            console.error(err.message || "Role was not saved.");
        }
    }

    async function addMenu(){
        const name = menuName.trim();
        if(!name)
            return;

        const nextMenu = allMenus.length ? Math.max(...allMenus.map((m) => Number(m.mid) || 0)) + 1 : 1;
        const menuData = { mid: nextMenu, icon: "dashboard.png", menu: name };

        try{
            await requestApi("/authservice/menus", {
                method: "POST",
                body: JSON.stringify(menuData)
            });
            setMenuName("");
            await loadRoleManagerData(localStorage.getItem("token") || "");
        }catch(err){
            console.error(err.message || "Menu was not saved.");
        }
    }

    function logout(){
        localStorage.clear();
        window.location.replace("/");
    }

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token)
            logout();
        else{
            callApi("GET", apibaseurl + "/authservice/uinfo", null, null, loadUinfo, token);
            setTimeout(() => loadRoleManagerData(token), 0);
        }
    }, []);

    useEffect(() => {
        if(selectedMenu === "User Manager")
            loadUsers();
    }, [selectedMenu]);

    function getRoleName(roleId){
        const role = roles.find((r) => Number(r.role) === Number(roleId));
        return role?.rolename || `Role ${roleId}`;
    }

    function renderContent(){
        if(selectedMenu === "Roles")
            return (
                <div className='roles-workspace'>
                    <section className='roles-hero'>
                        <div>
                            <h1>Roles</h1>
                        </div>
                    </section>

                    <div className='create-grid'>
                        <section className='role-panel compact-panel'>
                            <div className='panel-title'>
                                <span>R</span>
                                <h2>Create Role</h2>
                            </div>
                            <input
                                value={roleName}
                                placeholder='Role name'
                                onChange={(e) => setRoleName(e.target.value)}
                            />
                            <button onClick={() => addRole()}>Add Role</button>
                        </section>

                        <section className='role-panel available-roles-panel'>
                            <div className='panel-title'>
                                <span>A</span>
                                <h2>Available Roles</h2>
                            </div>
                            <div className='available-roles-list'>
                                {roles.map((role) => (
                                    <div className='available-role-item' key={role.role}>
                                        <strong>{role.rolename}</strong>
                                        <span>ID {role.role}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className='role-panel menu-panel'>
                            <div className='panel-title'>
                                <span>M</span>
                                <h2>Create Menu</h2>
                            </div>
                            <div className='inline-form'>
                                <input
                                    value={menuName}
                                    placeholder='Menu name'
                                    onChange={(e) => setMenuName(e.target.value)}
                                />
                                <button onClick={() => addMenu()}>Add Menu</button>
                            </div>
                        </section>
                    </div>
                </div>
            );

        if(selectedMenu === "User Manager")
            return (
                <div className='users-workspace'>
                    <section className='users-hero'>
                        <h1>Users</h1>
                        <button onClick={() => loadUsers()}>Refresh</button>
                    </section>

                    <section className='users-panel'>
                        <div className='users-table'>
                            <div className='users-row users-head'>
                                <span>Name</span>
                                <span>Email</span>
                                <span>Phone</span>
                                <span>Role</span>
                                <span>Status</span>
                            </div>
                            {users.map((user) => (
                                <div className='users-row' key={user.id}>
                                    <span>{user.fullname}</span>
                                    <span>{user.email}</span>
                                    <span>{user.phone}</span>
                                    <span>{getRoleName(user.role)}</span>
                                    <span>{user.status === 1 ? "Active" : "Inactive"}</span>
                                </div>
                            ))}
                            {users.length === 0 && (
                                <div className='empty-users'>No users found.</div>
                            )}
                        </div>
                    </section>
                </div>
            );

        return <div className='content-placeholder'>{selectedMenu}</div>;
    }

    return (
        <div className='home'>
            <div className='home-header'>
                <img src="/logo.png" alt='' />
                <div className='info'>
                    {fullname}
                    <img src="/shutdown.png" alt='' onClick={()=>logout()} />
                </div>
            </div>
            <div className='home-workspace'>
                <div className='home-menus'>
                    <ul>
                        {visibleMenus.map((m)=>(
                            <li className={selectedMenu === m.menu ? "active" : ""} key={m.mid} onClick={() => setSelectedMenu(m.menu)}>
                                <img src={imgurl + m.icon} alt='' />{m.menu}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='home-content'>
                    <div className='content-title'>Content</div>
                    {renderContent()}
                </div>
            </div>
            <div className='home-footer'>Copyright @ 2026. All rights reserved.</div>

            <ProgressBar isProgress={isProgress}/>
        </div>
    );
}

export default Home;
