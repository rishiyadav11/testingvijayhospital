# Fix imports in blog form pages
sed -i "s|from '@/components/ui/Input'|from '@/components/ui/input'|g" src/app/admin/\(dashboard\)/blogs/new/page.tsx
sed -i "s|from '@/components/ui/Input'|from '@/components/ui/input'|g" src/app/admin/\(dashboard\)/blogs/\[id\]/page.tsx
echo "Fixed imports"
