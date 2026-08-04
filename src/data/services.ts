export interface ServiceItem {
    title: string;
    id: string;
    imageBefore: string;
    imageAfter: string;
    itemCount: number;
    material: string;
}

export const SERVICES: ServiceItem[] = [
    {
        title: 'Wash Down',
        id: 'washDown',
        imageBefore: '/assets/images/services/wash_down_antes.webp',
        imageAfter: '/assets/images/services/wash_down_despues.webp',
        itemCount: 4,
        material: 'CASCO',
    },
    {
        title: 'Premium Detailed Wash',
        id: 'premiumDetailedWash',
        imageBefore: '/assets/images/services/Detailing_antes.webp',
        imageAfter: '/assets/images/services/Detailing_despues.webp',
        itemCount: 6,
        material: 'GELCOAT',
    },
    {
        title: 'Teak Cleaning & Treatment',
        id: 'teakCleaning',
        imageBefore: '/assets/images/services/Teak_antes.webp',
        imageAfter: '/assets/images/services/Teak_despues.webp',
        itemCount: 3,
        material: 'TECA',
    },
    {
        title: 'Metal Polish',
        id: 'metalPolish',
        imageBefore: '/assets/images/services/metal_polish_antes.webp',
        imageAfter: '/assets/images/services/metal_polish_despues.webp',
        itemCount: 3,
        material: 'ACERO',
    },
    {
        title: 'Engine Room Care',
        id: 'engineRoomCare',
        imageBefore: '/assets/images/services/engine_room_antes.webp',
        imageAfter: '/assets/images/services/engine_room_despues.webp',
        itemCount: 3,
        material: 'SALA DE MÁQUINAS',
    },
];
