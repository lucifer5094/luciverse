import { motion } from 'framer-motion';
import { ClanMember } from '../data';
import Image from 'next/image';

const MemberList = ({ members }: { members: ClanMember[] }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-800">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Name</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Role</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Trophies</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Donations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                            {members.map((member) => (
                                <tr key={member.tag}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{member.name}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{member.role}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{member.trophies} 🏆</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{member.donations} / {member.donationsReceived}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </motion.div>
);

export default MemberList;