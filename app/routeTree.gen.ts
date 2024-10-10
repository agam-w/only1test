/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LogoutImport } from './routes/logout'
import { Route as LoginImport } from './routes/login'
import { Route as AppImport } from './routes/_app'
import { Route as AppIndexImport } from './routes/_app/index'
import { Route as AppTodoImport } from './routes/_app/todo'
import { Route as AppReceivedImport } from './routes/_app/received'

// Create/Update Routes

const LogoutRoute = LogoutImport.update({
  path: '/logout',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AppRoute = AppImport.update({
  id: '/_app',
  getParentRoute: () => rootRoute,
} as any)

const AppIndexRoute = AppIndexImport.update({
  path: '/',
  getParentRoute: () => AppRoute,
} as any)

const AppTodoRoute = AppTodoImport.update({
  path: '/todo',
  getParentRoute: () => AppRoute,
} as any)

const AppReceivedRoute = AppReceivedImport.update({
  path: '/received',
  getParentRoute: () => AppRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_app': {
      id: '/_app'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/logout': {
      id: '/logout'
      path: '/logout'
      fullPath: '/logout'
      preLoaderRoute: typeof LogoutImport
      parentRoute: typeof rootRoute
    }
    '/_app/received': {
      id: '/_app/received'
      path: '/received'
      fullPath: '/received'
      preLoaderRoute: typeof AppReceivedImport
      parentRoute: typeof AppImport
    }
    '/_app/todo': {
      id: '/_app/todo'
      path: '/todo'
      fullPath: '/todo'
      preLoaderRoute: typeof AppTodoImport
      parentRoute: typeof AppImport
    }
    '/_app/': {
      id: '/_app/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AppIndexImport
      parentRoute: typeof AppImport
    }
  }
}

// Create and export the route tree

interface AppRouteChildren {
  AppReceivedRoute: typeof AppReceivedRoute
  AppTodoRoute: typeof AppTodoRoute
  AppIndexRoute: typeof AppIndexRoute
}

const AppRouteChildren: AppRouteChildren = {
  AppReceivedRoute: AppReceivedRoute,
  AppTodoRoute: AppTodoRoute,
  AppIndexRoute: AppIndexRoute,
}

const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof AppRouteWithChildren
  '/login': typeof LoginRoute
  '/logout': typeof LogoutRoute
  '/received': typeof AppReceivedRoute
  '/todo': typeof AppTodoRoute
  '/': typeof AppIndexRoute
}

export interface FileRoutesByTo {
  '/login': typeof LoginRoute
  '/logout': typeof LogoutRoute
  '/received': typeof AppReceivedRoute
  '/todo': typeof AppTodoRoute
  '/': typeof AppIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_app': typeof AppRouteWithChildren
  '/login': typeof LoginRoute
  '/logout': typeof LogoutRoute
  '/_app/received': typeof AppReceivedRoute
  '/_app/todo': typeof AppTodoRoute
  '/_app/': typeof AppIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/login' | '/logout' | '/received' | '/todo' | '/'
  fileRoutesByTo: FileRoutesByTo
  to: '/login' | '/logout' | '/received' | '/todo' | '/'
  id:
    | '__root__'
    | '/_app'
    | '/login'
    | '/logout'
    | '/_app/received'
    | '/_app/todo'
    | '/_app/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AppRoute: typeof AppRouteWithChildren
  LoginRoute: typeof LoginRoute
  LogoutRoute: typeof LogoutRoute
}

const rootRouteChildren: RootRouteChildren = {
  AppRoute: AppRouteWithChildren,
  LoginRoute: LoginRoute,
  LogoutRoute: LogoutRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_app",
        "/login",
        "/logout"
      ]
    },
    "/_app": {
      "filePath": "_app.tsx",
      "children": [
        "/_app/received",
        "/_app/todo",
        "/_app/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/logout": {
      "filePath": "logout.tsx"
    },
    "/_app/received": {
      "filePath": "_app/received.tsx",
      "parent": "/_app"
    },
    "/_app/todo": {
      "filePath": "_app/todo.tsx",
      "parent": "/_app"
    },
    "/_app/": {
      "filePath": "_app/index.tsx",
      "parent": "/_app"
    }
  }
}
ROUTE_MANIFEST_END */
