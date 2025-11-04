export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: number;
    category: string;
}
export type Usage = {
    _id: string;
    project: boolean;
    name: string;
    email: string;
    phone: string;
    quantity: number;
    reqId: string;
    projectName: string;
}

export type Component = {
    _id: string;
    image: string;
    component: string;
    category: string;
    inStock: number;
    inUse: number;
    usedWhere: Usage[];
    link: string | null;            // | null as this feature for added later on
}

export type Request = {
    _id: string;
    inventoryId: string;
    component: string;
    image: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    purpose: string;
    quantity: number;
    date: string;
    status: string;
    returned: boolean;
    returnedProject: string;
    usageId: string;
}

export type Project = {
    _id: string;
    title: string;
    leadName: string;
    leadEmail: string;
    image: string;
    completed: boolean;
    startDate: string;
    endDate: string;
    category: string;
}

export type UserInventory = {
    _id: string;
    reqId: string;
    inventoryId: string;
    inventoryName: string;
    inventoryImage: string;
    quantity: string;
    purpose: string;
    returningData: string;
    returned: boolean;
    status: string;
}

export type Admin = {
    _id: string;
    email: string;
    category: string;
}

export type SuperAdmin = {
    _id: string;
    email: string;
}