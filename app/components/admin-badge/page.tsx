"use client";

import AdminBadgeComponent from "@/components/admin/AdminBadgeComponent";
import ComponentLayout from "@/components/layouts/ComponentLayout";

const AdminBadgePage = () => {
    return (
        <ComponentLayout
            componentTitle="Admin Badge"
            componentPath="@/components/admin/AdminBadgeComponent.tsx"
            params={AdminBadgeComponent.Params}
        >
            <AdminBadgeComponent
                label="支払い済み"
                isLink={false}/>
            <AdminBadgeComponent
                label="配送済み"
                isLink={false}/>
            <AdminBadgeComponent
                label="キャンセル"
                isLink={false}/>
            <AdminBadgeComponent
                label="返品"
                isLink={false}/>
            <AdminBadgeComponent
                label="販売中"
                isLink={true}/>
            <AdminBadgeComponent
                label="販売停止"
                isLink={true}/>
            <AdminBadgeComponent
                label="有効"
                isLink={true}/>
            <AdminBadgeComponent
                label="無効"
                isLink={true}/>
        </ComponentLayout>
    );
};

export default AdminBadgePage;