import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addWorkspaceMember } from "../features/workspaceSlice";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";

const InviteMemberDialog = ({ isDialogOpen, setIsDialogOpen }) => {

    const dispatch = useDispatch();
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        role: "org:member",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentWorkspace) {
            toast.error('No workspace selected for invitation.');
            return;
        }

        if (!formData.email.trim()) {
            toast.error('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);

        try {
            const normalizedEmail = formData.email.trim().toLowerCase();
            const existingMember = currentWorkspace.members?.find(
                (member) => member.user?.email?.toLowerCase() === normalizedEmail
            );

            if (existingMember) {
                toast.error('This user is already a member of the workspace.');
                return;
            }

            const memberId = Date.now().toString();
            const roleLabel = formData.role === 'org:admin' ? 'ADMIN' : 'MEMBER';
            const newMember = {
                id: memberId,
                userId: memberId,
                workspaceId: currentWorkspace.id,
                message: 'Invitation sent',
                role: roleLabel,
                user: {
                    id: memberId,
                    name: 'Invited Member',
                    email: normalizedEmail,
                    image: assets.profile_img_a,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            };

            dispatch(addWorkspaceMember({ workspaceId: currentWorkspace.id, member: newMember }));

            const invitation = {
                id: Date.now().toString(),
                email: normalizedEmail,
                role: formData.role,
                workspaceId: currentWorkspace.id,
                workspaceName: currentWorkspace.name,
                invitedAt: new Date().toISOString(),
                status: 'pending',
            };

            const existingInvitations = JSON.parse(localStorage.getItem('projectInvitations') || '[]');
            existingInvitations.push(invitation);
            localStorage.setItem('projectInvitations', JSON.stringify(existingInvitations));

            const subject = encodeURIComponent(`Invitation to join ${currentWorkspace.name}`);
            const body = encodeURIComponent(
                `You have been invited to join the workspace "${currentWorkspace.name}" as a ${roleLabel}.

Click here to accept the invitation and start contributing.

Best regards,
Project Management Team`
            );
            window.location.href = `mailto:${normalizedEmail}?subject=${subject}&body=${body}`;

            toast.success(`Invitation sent to ${normalizedEmail}!`);
            setFormData({ email: "", role: "org:member" });
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Invite member error:', error);
            toast.error('Failed to send invitation. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isDialogOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200">
                {/* Header */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <UserPlus className="size-5 text-zinc-900 dark:text-zinc-200" /> Invite Team Member
                    </h2>
                    {currentWorkspace && (
                        <p className="text-sm text-zinc-700 dark:text-zinc-400">
                            Inviting to workspace: <span className="text-blue-600 dark:text-blue-400">{currentWorkspace.name}</span>
                        </p>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 w-4 h-4" />
                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email address" className="pl-10 mt-1 w-full rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 text-sm placeholder-zinc-400 dark:placeholder-zinc-500 py-2 focus:outline-none focus:border-blue-500" required />
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Role</label>
                        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 py-2 px-3 mt-1 focus:outline-none focus:border-blue-500 text-sm" >
                            <option value="org:member">Member</option>
                            <option value="org:admin">Admin</option>
                        </select>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setIsDialogOpen(false)} className="px-5 py-2 rounded text-sm border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" >
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting || !currentWorkspace} className="px-5 py-2 rounded text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white disabled:opacity-50 hover:opacity-90 transition" >
                            {isSubmitting ? "Sending..." : "Send Invitation"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteMemberDialog;
