import { TResponseWithError } from '../../shared/types';

export type SessionViewModel = {
    ip: string;
    title: string;
    lastActiveDate: number;
    deviceId: string;
};

export type TGetAllSessionDevicesResponse = TResponseWithError<
    SessionViewModel[]
>;
