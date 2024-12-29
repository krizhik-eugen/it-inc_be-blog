import { TResponseWithError } from '../../shared/types';

export type SessionViewModel = {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
};

export type TGetAllSessionDevicesResponse = TResponseWithError<
    SessionViewModel[]
>;
